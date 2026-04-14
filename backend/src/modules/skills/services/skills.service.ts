import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, QueryFailedError } from 'typeorm';
import { SkillEntity } from '@/infrastructure/database/entities/skill.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from '../dtos/skill.dto';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    @InjectRepository(SkillEntity) private skillRepository: Repository<SkillEntity>,
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
  ) {}

  async create(createSkillDto: CreateSkillDto, userId: string): Promise<SkillEntity> {
    this.logger.log(`Creating skill: ${createSkillDto.name}`);

    const skill = this.skillRepository.create({
      ...createSkillDto,
      ownerId: userId,
      status: 'active',
    });

    try {
      return await this.skillRepository.save(skill);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('A skill with this name already exists for your account');
      }
      throw error;
    }
  }

  async findAll(userId?: string, query?: QuerySkillsDto): Promise<{ skills: SkillEntity[]; total: number }> {
    const qb = this.skillRepository.createQueryBuilder('skill');

    if (userId) {
      qb.where('skill.ownerId = :userId', { userId });
    }

    if (query?.status) {
      qb.andWhere('skill.status = :status', { status: query.status });
    }

    if (query?.type) {
      qb.andWhere('skill.type = :type', { type: query.type });
    }

    const skip = query?.skip || 0;
    const limit = query?.limit || 10;

    const [skills, total] = await qb.skip(skip).take(limit).orderBy('skill.createdAt', 'DESC').getManyAndCount();
    return { skills, total };
  }

  async findOne(id: string, userId?: string): Promise<SkillEntity> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: ['agents'],
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    if (userId && skill.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this skill');
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto, userId?: string): Promise<SkillEntity> {
    const skill = await this.findOne(id, userId);

    if (updateSkillDto.name) {
      skill.name = updateSkillDto.name;
    }
    if (updateSkillDto.description) {
      skill.description = updateSkillDto.description;
    }
    if (updateSkillDto.config) {
      skill.config = updateSkillDto.config;
    }
    if (updateSkillDto.status) {
      skill.status = updateSkillDto.status;
    }
    if (updateSkillDto.retryConfig) {
      skill.retryConfig = updateSkillDto.retryConfig;
    }
    if (updateSkillDto.timeout !== undefined) {
      skill.timeout = updateSkillDto.timeout;
    }

    try {
      return await this.skillRepository.save(skill);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('A skill with this name already exists for your account');
      }
      throw error;
    }
  }

  async delete(id: string, userId?: string): Promise<void> {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
  }

  async assignToAgent(skillId: string, agentId: string, userId: string): Promise<SkillEntity> {
    this.logger.log(`Assigning skill ${skillId} to agent ${agentId}`);

    const skill = await this.findOne(skillId, userId);
    const agent = await this.agentRepository.findOne({
      where: { id: agentId, ownerId: userId },
      relations: ['skills'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found or you do not have permission to modify it');
    }

    if (!agent.skills) {
      agent.skills = [];
    }

    if (!agent.skills.find((s) => s.id === skillId)) {
      agent.skills.push(skill);
      await this.agentRepository.save(agent);
    }

    return skill;
  }

  async removeFromAgent(skillId: string, agentId: string, userId: string): Promise<void> {
    this.logger.log(`Removing skill ${skillId} from agent ${agentId}`);

    const skill = await this.findOne(skillId, userId);
    const agent = await this.agentRepository.findOne({
      where: { id: agentId, ownerId: userId },
      relations: ['skills'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found or you do not have permission to modify it');
    }

    if (agent.skills) {
      agent.skills = agent.skills.filter((s) => s.id !== skillId);
      await this.agentRepository.save(agent);
    }
  }

  private isDuplicateKeyError(error: any): boolean {
    return error instanceof QueryFailedError && error.driverError?.code === '23505';
  }
}
