import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillRunEntity } from '@/infrastructure/database/entities/skill-run.entity';
import { QuerySkillsDto } from '../dtos/skill.dto';

@Injectable()
export class SkillRunsService {
  private readonly logger = new Logger(SkillRunsService.name);

  constructor(@InjectRepository(SkillRunEntity) private skillRunRepository: Repository<SkillRunEntity>) {}

  async create(skillId: string, userId: string, input: Record<string, any>, metadata?: Record<string, any>): Promise<SkillRunEntity> {
    const skillRun = this.skillRunRepository.create({
      skillId,
      userId,
      input,
      status: 'pending',
      metadata,
      retryCount: 0,
    });

    return await this.skillRunRepository.save(skillRun);
  }

  async findOne(id: string, userId?: string): Promise<SkillRunEntity> {
    const run = await this.skillRunRepository.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException(`Skill run with ID ${id} not found`);
    }

    if (userId && run.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this skill run');
    }

    return run;
  }

  async findRunsBySkill(skillId: string, userId: string, query?: QuerySkillsDto): Promise<{ runs: SkillRunEntity[]; total: number }> {
    const qb = this.skillRunRepository.createQueryBuilder('run').where('run.skillId = :skillId AND run.userId = :userId', {
      skillId,
      userId,
    });

    if (query?.status) {
      qb.andWhere('run.status = :status', { status: query.status });
    }

    const skip = query?.skip || 0;
    const limit = query?.limit || 10;

    const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();

    return { runs, total };
  }

  async findRunsByAgent(agentId: string, userId: string, query?: QuerySkillsDto): Promise<{ runs: SkillRunEntity[]; total: number }> {
    const qb = this.skillRunRepository.createQueryBuilder('run').where('run.agentRunId IS NOT NULL AND run.userId = :userId', {
      userId,
    });

    if (query?.status) {
      qb.andWhere('run.status = :status', { status: query.status });
    }

    const skip = query?.skip || 0;
    const limit = query?.limit || 10;

    const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();

    return { runs, total };
  }

  async updateStatus(id: string, status: string, output?: any, error?: string, executionTime?: number): Promise<SkillRunEntity> {
    const run = await this.findOne(id);
    run.status = status as any;
    if (output) {
      run.output = output;
    }
    if (error) {
      run.error = error;
    }
    if (executionTime !== undefined) {
      run.executionTime = executionTime;
    }
    return await this.skillRunRepository.save(run);
  }

  async incrementRetry(id: string): Promise<SkillRunEntity> {
    const run = await this.findOne(id);
    run.retryCount += 1;
    return await this.skillRunRepository.save(run);
  }
}
