import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainRunEntity } from '@/infrastructure/database/entities/chain-run.entity';
import { ChainEntity } from '@/infrastructure/database/entities/chain.entity';
import { AgentRunsService } from '@/modules/agent-runs/services/agent-runs.service';
import { ChainsService } from './chains.service';
import { ChainNodesService } from './chain-nodes.service';
import { QueryChainRunsDto } from '../dtos/chain.dto';

@Injectable()
export class ChainRunsService {
  private readonly logger = new Logger(ChainRunsService.name);

  constructor(
    @InjectRepository(ChainRunEntity) private chainRunRepository: Repository<ChainRunEntity>,
    @InjectRepository(ChainEntity) private chainRepository: Repository<ChainEntity>,
    private chainsService: ChainsService,
    private chainNodesService: ChainNodesService,
    private agentRunsService: AgentRunsService,
  ) {}

  async findAll(query: QueryChainRunsDto & { userId?: string; chainId?: string }): Promise<{ runs: ChainRunEntity[]; total: number }> {
    const qb = this.chainRunRepository.createQueryBuilder('run');

    if (query.userId) {
      qb.where('run.userId = :userId', { userId: query.userId });
    }

    if (query.chainId) {
      qb.andWhere('run.chainId = :chainId', { chainId: query.chainId });
    }

    if (query.status) {
      qb.andWhere('run.status = :status', { status: query.status });
    }

    const skip = query.skip || 0;
    const limit = query.limit || 10;

    const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();

    return { runs, total };
  }

  async findOne(id: string, userId?: string): Promise<ChainRunEntity> {
    const run = await this.chainRunRepository.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException(`Chain run with ID ${id} not found`);
    }

    if (userId && run.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this chain run');
    }

    return run;
  }

  async getRunsByChain(chainId: string, skip = 0, limit = 10, userId?: string, status?: string): Promise<{ runs: ChainRunEntity[]; total: number }> {
    const where: any = { chainId };
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }

    const [runs, total] = await this.chainRunRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { runs, total };
  }

  async executeChainRun(
    chainId: string,
    userId: string,
    parameters: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; output: any; executionTime: number; runId: string; intermediateResults: any[] }> {
    this.logger.log(`Executing chain run for chain: ${chainId}`);

    const startTime = Date.now();

    // Validate chain exists and user owns it
    const chain = await this.chainsService.findOne(chainId, userId);

    if (!chain.startingPrompt) {
      throw new BadRequestException(`Chain ${chainId} does not have a starting prompt`);
    }

    // Get nodes
    const nodes = await this.chainNodesService.getNodesByChain(chainId);

    if (nodes.length === 0) {
      throw new BadRequestException(`Chain ${chainId} has no nodes`);
    }

    // Create chain run record
    const chainRun = this.chainRunRepository.create({
      chainId,
      userId,
      input: { parameters, startingPrompt: chain.startingPrompt },
      status: 'running',
      intermediateResults: [],
      metadata,
    });

    const savedRun = await this.chainRunRepository.save(chainRun);

    try {
      let context: Record<string, any> = {
        startingPrompt: this.fillPromptTemplate(chain.startingPrompt, parameters),
      };

      const intermediateResults: any[] = [];

      // Execute each node in sequence
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        this.logger.log(`Executing node ${i + 1}/${nodes.length} (agent: ${node.agentId})`);

        try {
          // Prepare input for agent: combine previous output with context
          let nodeInput: Record<string, any>;

          if (i === 0) {
            // First node: use starting prompt + parameters
            nodeInput = { ...parameters };
          } else {
            // Subsequent nodes: pass previous result as context
            const previousOutput = intermediateResults[i - 1];
            nodeInput = {
              ...parameters,
              previousOutput: previousOutput?.output?.output || previousOutput?.output || '',
              context: context,
            };
          }

          // Get agent and execute
          const agent = node.agent;

          if (!agent.promptTemplate) {
            throw new BadRequestException(`Agent ${node.agentId} does not have a prompt template`);
          }

          if (!agent.modelId) {
            throw new BadRequestException(`Agent ${node.agentId} does not have a model assigned`);
          }

          const agentTemperature = node.nodeConfig?.temperature || agent.temperature;

          // Execute agent
          const agentResult = await this.agentRunsService.executeAgentRun(
            node.agentId,
            userId,
            nodeInput,
            agent.promptTemplate,
            agent.modelId,
            agentTemperature,
            { chainRunId: savedRun.id, nodeOrder: i, chainId },
          );

          intermediateResults.push({
            nodeId: node.id,
            nodeOrder: i,
            agentId: node.agentId,
            agentRunId: agentResult.runId,
            output: agentResult.output,
            executionTime: agentResult.executionTime,
            status: 'completed',
          });

          // Update context for next node
          context.previousNodeOutput = agentResult.output;

          this.logger.log(`Node ${i + 1} completed successfully`);
        } catch (nodeError) {
          const executionTime = Date.now() - startTime;

          intermediateResults.push({
            nodeId: node.id,
            nodeOrder: i,
            agentId: node.agentId,
            output: null,
            error: nodeError instanceof Error ? nodeError.message : String(nodeError),
            executionTime: Date.now() - startTime,
            status: 'failed',
          });

          savedRun.status = 'failed';
          savedRun.error = `Node ${i} execution failed: ${nodeError instanceof Error ? nodeError.message : String(nodeError)}`;
          savedRun.intermediateResults = intermediateResults;
          savedRun.executionTime = executionTime;
          await this.chainRunRepository.save(savedRun);

          this.logger.error(`Node ${i + 1} execution failed: ${nodeError}`);
          throw new BadRequestException(
            `Chain execution failed at node ${i + 1}: ${nodeError instanceof Error ? nodeError.message : String(nodeError)}`,
          );
        }
      }

      const executionTime = Date.now() - startTime;

      // Set final output from last node
      const finalOutput = intermediateResults[intermediateResults.length - 1]?.output;

      savedRun.output = finalOutput;
      savedRun.status = 'completed';
      savedRun.intermediateResults = intermediateResults;
      savedRun.executionTime = executionTime;
      await this.chainRunRepository.save(savedRun);

      return {
        success: true,
        output: finalOutput,
        executionTime,
        runId: savedRun.id,
        intermediateResults,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      savedRun.status = 'failed';
      savedRun.error = error instanceof Error ? error.message : String(error);
      savedRun.executionTime = executionTime;
      await this.chainRunRepository.save(savedRun);

      this.logger.error(`Chain execution failed: ${error}`);
      throw new BadRequestException(
        `Chain execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private fillPromptTemplate(template: string, parameters: Record<string, any>): string {
    let filledPrompt = template;
    const parameterRegex = /{(\w+)}/g;
    const matches = filledPrompt.match(parameterRegex);

    if (matches) {
      matches.forEach((match) => {
        const paramName = match.slice(1, -1);
        const paramValue = parameters[paramName];
        if (paramValue !== undefined) {
          filledPrompt = filledPrompt.replace(new RegExp(match, 'g'), paramValue);
        }
      });
    }

    return filledPrompt;
  }
}
