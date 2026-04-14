import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, QueryFailedError } from 'typeorm';
import { ChainEntity } from '@/infrastructure/database/entities/chain.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { CreateChainDto, UpdateChainDto, QueryChainsDto } from '../dtos/chain.dto';

@Injectable()
export class ChainsService {
  private readonly logger = new Logger(ChainsService.name);

  constructor(
    @InjectRepository(ChainEntity) private chainRepository: Repository<ChainEntity>,
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
  ) {}

  async create(createChainDto: CreateChainDto, userId: string): Promise<ChainEntity> {
    this.logger.log(`Creating chain: ${createChainDto.name}`);

    const chain = this.chainRepository.create({
      ...createChainDto,
      ownerId: userId,
      status: 'active',
      nodes: [],
    });

    try {
      return await this.chainRepository.save(chain);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('A chain with this name already exists for your account');
      }
      throw error;
    }
  }

  async findAll(userId?: string, query?: QueryChainsDto): Promise<{ chains: ChainEntity[]; total: number }> {
    const qb = this.chainRepository.createQueryBuilder('chain').leftJoinAndSelect('chain.nodes', 'nodes').leftJoinAndSelect('nodes.agent', 'agent');

    if (userId) {
      qb.where('chain.ownerId = :userId', { userId });
    }

    if (query?.status) {
      qb.andWhere('chain.status = :status', { status: query.status });
    }

    const skip = query?.skip || 0;
    const limit = query?.limit || 10;

    const [chains, total] = await qb.skip(skip).take(limit).orderBy('chain.createdAt', 'DESC').getManyAndCount();
    return { chains, total };
  }

  async findOne(id: string, userId?: string): Promise<ChainEntity> {
    const chain = await this.chainRepository.findOne({
      where: { id },
      relations: ['nodes', 'nodes.agent'],
    });

    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }

    if (userId && chain.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this chain');
    }

    return chain;
  }

  async update(id: string, updateChainDto: UpdateChainDto, userId?: string): Promise<ChainEntity> {
    const chain = await this.findOne(id, userId);

    if (updateChainDto.name) {
      chain.name = updateChainDto.name;
    }
    if (updateChainDto.description) {
      chain.description = updateChainDto.description;
    }
    if (updateChainDto.startingPrompt) {
      chain.startingPrompt = updateChainDto.startingPrompt;
    }
    if (updateChainDto.config) {
      chain.config = updateChainDto.config;
    }

    try {
      return await this.chainRepository.save(chain);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('A chain with this name already exists for your account');
      }
      throw error;
    }
  }

  async delete(id: string, userId?: string): Promise<void> {
    const chain = await this.findOne(id, userId);
    await this.chainRepository.remove(chain);
  }

  private isDuplicateKeyError(error: any): boolean {
    return error instanceof QueryFailedError && error.driverError?.code === '23505';
  }
}
