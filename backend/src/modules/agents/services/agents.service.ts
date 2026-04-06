import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentWithParametersDto } from '../dtos/agent.dto';
import { ModelsService } from '@/modules/models/models.service';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
    @InjectRepository(ToolEntity) private toolRepository: Repository<ToolEntity>,
    @InjectRepository(PromptEntity) private promptRepository: Repository<PromptEntity>,
    @InjectRepository(AgentRunEntity) private agentRunRepository: Repository<AgentRunEntity>,
    @InjectRepository(ModelEntity) private modelRepository: Repository<ModelEntity>,
    private modelsService: ModelsService,
  ) {}

  async create(createAgentDto: CreateAgentDto, userId: string): Promise<AgentEntity> {
    this.logger.log(`Creating agent: ${createAgentDto.name}`);

    // Validate that the model exists
    const model = await this.modelRepository.findOne({
      where: { id: createAgentDto.modelId },
    });

    if (!model) {
      throw new BadRequestException(`Model with ID ${createAgentDto.modelId} not found`);
    }

    const agent = this.agentRepository.create({
      ...createAgentDto,
      ownerId: userId,
      status: 'active',
      modelId: createAgentDto.modelId,
    });

    if (createAgentDto.toolIds && createAgentDto.toolIds.length > 0) {
      agent.tools = await this.toolRepository.find({
        where: { id: In(createAgentDto.toolIds) }
      });
    }

    if (createAgentDto.promptId) {
      const prompt = await this.promptRepository.findOne({ where: { id: createAgentDto.promptId } });
      if (prompt) {
        agent.prompt = prompt;
        agent.promptId = prompt.id;
      }
    }

    return await this.agentRepository.save(agent);
  }

  async findAll(userId?: string, skip = 0, limit = 10): Promise<{ agents: AgentEntity[]; total: number }> {
    const query = this.agentRepository.createQueryBuilder('agent').leftJoinAndSelect('agent.model', 'model');

    if (userId) {
      query.where('agent.ownerId = :userId', { userId });
    }

    const [agents, total] = await query.skip(skip).take(limit).getManyAndCount();
    return { agents, total };
  }

  async findOne(id: string): Promise<AgentEntity> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['model'],
    });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto, userId?: string): Promise<AgentEntity> {
    this.logger.log(`Updating agent: ${id}`);

    const agent = await this.findOne(id);

    // If modelId is being updated, validate it exists
    if (updateAgentDto.modelId) {
      const model = await this.modelRepository.findOne({
        where: { id: updateAgentDto.modelId },
      });

      if (!model) {
        throw new BadRequestException(`Model with ID ${updateAgentDto.modelId} not found`);
      }
    }

    Object.assign(agent, updateAgentDto);

    if (updateAgentDto.toolIds) {
      agent.tools = await this.toolRepository.find({
        where: { id: In(updateAgentDto.toolIds) }
      });
    }

    if (updateAgentDto.promptId) {
      const prompt = await this.promptRepository.findOne({ where: { id: updateAgentDto.promptId } });
      if (prompt) {
        agent.prompt = prompt;
        agent.promptId = prompt.id;
      }
    }

    return await this.agentRepository.save(agent);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    this.logger.log(`Deleting agent: ${id}`);
    const result = await this.agentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return { success: true };
  }

  async getAgentsByUser(userId: string): Promise<AgentEntity[]> {
    return await this.agentRepository.find({ where: { ownerId: userId } });
  }

  async execute(
    agentId: string,
    executeDto: ExecuteAgentWithParametersDto,
    userId: string,
  ): Promise<{ success: boolean; output: any; executionTime: number; runId: string }> {
    this.logger.log(`Executing agent: ${agentId}`);

    const agent = await this.findOne(agentId);
    
    // Check if agent has a prompt template
    if (!agent.promptTemplate) {
      throw new BadRequestException(`Agent ${agentId} does not have a prompt template`);
    }

    // Check if agent has a model assigned
    if (!agent.modelId) {
      throw new BadRequestException(`Agent ${agentId} does not have a model assigned`);
    }

    // Load the model to get API key and temperature
    const model = await this.modelRepository.findOne({
      where: { id: agent.modelId },
    });

    if (!model) {
      throw new BadRequestException(`Model ${agent.modelId} not found`);
    }

    const decryptedApiKey = this.modelsService.decryptApiKey(model);
    const temperature = agent.temperature || model.temperature;

    const startTime = Date.now();
    
    // Replace placeholders in template with provided parameters
    let filledPrompt = agent.promptTemplate;
    const parameterRegex = /{(\w+)}/g;
    const matches = filledPrompt.match(parameterRegex);
    const parameters = executeDto.parameters || {};
    
    if (matches) {
      matches.forEach((match) => {
        const paramName = match.slice(1, -1); // Remove { and }
        const paramValue = parameters[paramName];
        if (paramValue !== undefined) {
          filledPrompt = filledPrompt.replace(new RegExp(match, 'g'), paramValue);
        }
      });
    }

    // Create an agent run record
    const run = this.agentRunRepository.create({
      agentId,
      userId,
      input: { template: agent.promptTemplate, parameters },
      status: 'pending',
      metadata: executeDto.metadata,
    });
    const savedRun = await this.agentRunRepository.save(run);

    try {
      // Simulate agent execution with model credentials and temperature
      // In a real implementation, this would call the actual LLM using decryptedApiKey and temperature
      const executionResult = {
        output: `Executed prompt with model ${model.name} (v${model.version}) at temperature ${temperature}:\n\n${filledPrompt}\n\nThis is a simulated execution result.`,
        model: model.name,
        version: model.version,
        temperature,
        status: 'completed',
      };

      const executionTime = Date.now() - startTime;

      // Update the run with the result
      savedRun.output = executionResult;
      savedRun.status = 'completed';
      savedRun.executionTime = executionTime;
      await this.agentRunRepository.save(savedRun);

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
      await this.agentRunRepository.save(savedRun);

      this.logger.error(`Agent execution failed: ${error}`);
      throw new BadRequestException(`Agent execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
