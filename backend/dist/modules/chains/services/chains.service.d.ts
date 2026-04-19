import { Repository } from 'typeorm';
import { ChainEntity } from '@/infrastructure/database/entities/chain.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { CreateChainDto, UpdateChainDto, QueryChainsDto } from '../dtos/chain.dto';
export declare class ChainsService {
    private chainRepository;
    private agentRepository;
    private readonly logger;
    constructor(chainRepository: Repository<ChainEntity>, agentRepository: Repository<AgentEntity>);
    create(createChainDto: CreateChainDto, userId: string): Promise<ChainEntity>;
    findAll(userId?: string, query?: QueryChainsDto): Promise<{
        chains: ChainEntity[];
        total: number;
    }>;
    findOne(id: string, userId?: string): Promise<ChainEntity>;
    update(id: string, updateChainDto: UpdateChainDto, userId?: string): Promise<ChainEntity>;
    delete(id: string, userId?: string): Promise<void>;
    private isDuplicateKeyError;
}
