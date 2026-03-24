import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { CreateAgentDto, UpdateAgentDto } from '../dtos/agent.dto';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
    @InjectRepository(ToolEntity) private toolRepository: Repository<ToolEntity>,
    @InjectRepository(PromptEntity) private promptRepository: Repository<PromptEntity>,
  ) {}

  async create(createAgentDto: CreateAgentDto, userId: string): Promise<AgentEntity> {
    this.logger.log(`Creating agent: ${createAgentDto.name}`);

    const agent = this.agentRepository.create({
      ...createAgentDto,
      ownerId: userId,
      status: 'active',
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
    const query = this.agentRepository.createQueryBuilder('agent');

    if (userId) {
      query.where('agent.ownerId = :userId', { userId });
    }

    const [agents, total] = await query.skip(skip).take(limit).getManyAndCount();
    return { agents, total };
  }

  async findOne(id: string): Promise<AgentEntity> {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<AgentEntity> {
    this.logger.log(`Updating agent: ${id}`);

    const agent = await this.findOne(id);

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
}
