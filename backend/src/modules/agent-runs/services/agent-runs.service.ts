import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { CreateAgentRunDto, QueryAgentRunsDto } from '../dtos/agent-run.dto';
import { LLMService } from '@/infrastructure/llm/llm.service';
import { ModelsService } from '@/modules/models/models.service';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { InjectRepository as InjectRepo } from '@nestjs/typeorm';

@Injectable()
export class AgentRunsService {
  private readonly logger = new Logger(AgentRunsService.name);

  constructor(
    @InjectRepository(AgentRunEntity) private runRepository: Repository<AgentRunEntity>,
    @InjectRepository(ModelEntity) private modelRepository: Repository<ModelEntity>,
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
    private llmService: LLMService,
    private modelsService: ModelsService,
  ) {}

  async create(createAgentRunDto: CreateAgentRunDto, userId: string): Promise<AgentRunEntity> {
    this.logger.log(`Creating agent run for agent: ${createAgentRunDto.agentId}`);

    const run = this.runRepository.create({
      ...createAgentRunDto,
      userId,
      status: 'pending',
    });

    return await this.runRepository.save(run);
  }

  async findAll(query: QueryAgentRunsDto & { userId?: string }): Promise<{ runs: AgentRunEntity[]; total: number }> {
    const qb = this.runRepository.createQueryBuilder('run');

    if (query.userId) {
      qb.where('run.userId = :userId', { userId: query.userId });
    }

    if (query.agentId) {
      qb.andWhere('run.agentId = :agentId', { agentId: query.agentId });
    }

    if (query.status) {
      qb.andWhere('run.status = :status', { status: query.status });
    }

    const skip = query.skip || 0;
    const limit = query.limit || 10;

    const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();

    return { runs, total };
  }

  async findOne(id: string, userId?: string): Promise<AgentRunEntity> {
    const run = await this.runRepository.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException(`Agent run with ID ${id} not found`);
    }

    if (userId && run.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this agent run');
    }

    return run;
  }

  async updateStatus(id: string, status: string, output?: any, error?: string): Promise<AgentRunEntity> {
    const run = await this.findOne(id);
    run.status = status;
    if (output) {
      run.output = output;
    }
    if (error) {
      run.error = error;
    }
    run.executionTime = run.executionTime || new Date().getTime() - new Date(run.createdAt).getTime();
    return await this.runRepository.save(run);
  }

  async getRunsByAgent(agentId: string, skip = 0, limit = 10, userId?: string): Promise<{ runs: AgentRunEntity[]; total: number }> {
    const where: any = { agentId };
    if (userId) {
      where.userId = userId;
    }

    const [runs, total] = await this.runRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { runs, total };
  }

  async getRunsByUser(userId: string, skip = 0, limit = 10): Promise<{ runs: AgentRunEntity[]; total: number }> {
    const [runs, total] = await this.runRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { runs, total };
  }

  async executeAgentRun(
    agentId: string,
    userId: string,
    parameters: Record<string, any>,
    promptTemplate: string,
    modelId: string,
    temperature?: number,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; output: any; executionTime: number; runId: string }> {
    this.logger.log(`Executing agent run for agent: ${agentId}`);

    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
      relations: ['model'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    if (!promptTemplate) {
      throw new BadRequestException(`Agent ${agentId} does not have a prompt template`);
    }

    if (!modelId) {
      throw new BadRequestException(`Agent ${agentId} does not have a model assigned`);
    }

    const model = await this.modelRepository.findOne({
      where: { id: modelId },
    });

    if (!model) {
      throw new BadRequestException(`Model ${modelId} not found`);
    }

    const decryptedApiKey = this.modelsService.decryptApiKey(model);
    const finalTemperature = temperature || model.temperature;

    const startTime = Date.now();

    let filledPrompt = promptTemplate;
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

    const run = this.runRepository.create({
      agentId,
      userId,
      input: { template: promptTemplate, parameters },
      status: 'pending',
      metadata,
    });
    const savedRun = await this.runRepository.save(run);

    try {
      let executionResult;

      const mockExecutionEnabled = process.env.MOCK_EXECUTION === 'true';

      if (mockExecutionEnabled) {
        this.logger.log('Using mock execution');
        executionResult = {
          output: `Executed prompt with model ${model.name} (v${model.version}) at temperature ${finalTemperature}:\n\n${filledPrompt}\n\nThis is a simulated execution result.`,
          model: model.name,
          version: model.version,
          temperature: finalTemperature,
          status: 'completed',
        };
      } else {
        this.logger.log('Using real LLM execution');
        try {
          const llmResponse = await this.llmService.execute({
            prompt: filledPrompt,
            temperature: parseFloat(String(finalTemperature)),
            model: model.name,
            apiKey: decryptedApiKey,
            maxTokens: 2000,
            timeout: 30000,
          });

          executionResult = {
            output: llmResponse.output,
            model: llmResponse.model,
            version: model.version,
            temperature: llmResponse.temperature,
            inputTokens: llmResponse.inputTokens,
            outputTokens: llmResponse.outputTokens,
            totalTokens: llmResponse.totalTokens,
            finishReason: llmResponse.finishReason,
            status: 'completed',
          };
        } catch (llmError) {
          this.logger.error(`LLM execution error: ${llmError}`);
          throw new BadRequestException(
            `LLM execution failed: ${llmError instanceof Error ? llmError.message : String(llmError)}`,
          );
        }
      }

      const executionTime = Date.now() - startTime;

      savedRun.output = executionResult;
      savedRun.status = 'completed';
      savedRun.executionTime = executionTime;
      await this.runRepository.save(savedRun);

      return {
        success: true,
        output: executionResult,
        executionTime,
        runId: savedRun.id,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      savedRun.status = 'failed';
      savedRun.error = error instanceof Error ? error.message : String(error);
      savedRun.executionTime = executionTime;
      await this.runRepository.save(savedRun);

      this.logger.error(`Agent execution failed: ${error}`);
      throw new BadRequestException(
        `Agent execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
