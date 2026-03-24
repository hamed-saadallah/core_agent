import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { CreateAgentRunDto, QueryAgentRunsDto } from '../dtos/agent-run.dto';

@Injectable()
export class AgentRunsService {
  private readonly logger = new Logger(AgentRunsService.name);

  constructor(@InjectRepository(AgentRunEntity) private runRepository: Repository<AgentRunEntity>) {}

  async create(createAgentRunDto: CreateAgentRunDto, userId: string): Promise<AgentRunEntity> {
    this.logger.log(`Creating agent run for agent: ${createAgentRunDto.agentId}`);

    const run = this.runRepository.create({
      ...createAgentRunDto,
      userId,
      status: 'pending',
    });

    return await this.runRepository.save(run);
  }

  async findAll(query: QueryAgentRunsDto): Promise<{ runs: AgentRunEntity[]; total: number }> {
    const qb = this.runRepository.createQueryBuilder('run');

    if (query.agentId) {
      qb.where('run.agentId = :agentId', { agentId: query.agentId });
    }

    if (query.status) {
      qb.andWhere('run.status = :status', { status: query.status });
    }

    const skip = query.skip || 0;
    const limit = query.limit || 10;

    const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();

    return { runs, total };
  }

  async findOne(id: string): Promise<AgentRunEntity> {
    const run = await this.runRepository.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException(`Agent run with ID ${id} not found`);
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

  async getRunsByAgent(agentId: string, skip = 0, limit = 10): Promise<{ runs: AgentRunEntity[]; total: number }> {
    const [runs, total] = await this.runRepository.findAndCount({
      where: { agentId },
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
}
