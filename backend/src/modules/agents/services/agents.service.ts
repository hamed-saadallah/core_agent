import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, QueryFailedError } from 'typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentWithParametersDto } from '../dtos/agent.dto';
import { ModelsService } from '@/modules/models/models.service';
import { LLMService } from '@/infrastructure/llm/llm.service';
import { AgentRunsService } from '@/modules/agent-runs/services/agent-runs.service';

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
    private llmService: LLMService,
    private agentRunsService: AgentRunsService,
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

    try {
      return await this.agentRepository.save(agent);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('An agent with this name already exists for your account');
      }
      throw error;
    }
  }

  async findAll(userId?: string, skip = 0, limit = 10): Promise<{ agents: AgentEntity[]; total: number }> {
    const query = this.agentRepository.createQueryBuilder('agent').leftJoinAndSelect('agent.model', 'model');

    if (userId) {
      query.where('agent.ownerId = :userId', { userId });
    }

    const [agents, total] = await query.skip(skip).take(limit).getManyAndCount();
    return { agents, total };
  }

  async findOne(id: string, userId?: string): Promise<AgentEntity> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['model'],
    });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    // Check ownership if userId is provided
    if (userId && agent.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this agent');
    }
    
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto, userId?: string): Promise<AgentEntity> {
    this.logger.log(`Updating agent: ${id}`);

    const agent = await this.findOne(id, userId);

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

    try {
      return await this.agentRepository.save(agent);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('An agent with this name already exists for your account');
      }
      throw error;
    }
  }

  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    this.logger.log(`Deleting agent: ${id}`);
    
    // Check ownership first
    const agent = await this.findOne(id, userId);
    
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

    const agent = await this.findOne(agentId, userId);
    
    if (!agent.promptTemplate) {
      throw new BadRequestException(`Agent ${agentId} does not have a prompt template`);
    }

    if (!agent.modelId) {
      throw new BadRequestException(`Agent ${agentId} does not have a model assigned`);
    }

    return await this.agentRunsService.executeAgentRun(
      agentId,
      userId,
      executeDto.parameters || {},
      agent.promptTemplate,
      agent.modelId,
      agent.temperature,
      executeDto.metadata,
    );
  }

  private isDuplicateKeyError(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }
    const pgError = error as QueryFailedError & { code?: string };
    return pgError.code === '23505';
  }
}
