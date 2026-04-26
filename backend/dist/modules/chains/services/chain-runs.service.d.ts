import { Repository } from 'typeorm';
import { ChainRunEntity } from '../../../infrastructure/database/entities/chain-run.entity';
import { ChainEntity } from '../../../infrastructure/database/entities/chain.entity';
import { AgentRunsService } from '../../../modules/agent-runs/services/agent-runs.service';
import { ChainsService } from './chains.service';
import { ChainNodesService } from './chain-nodes.service';
import { QueryChainRunsDto } from '../dtos/chain.dto';
export declare class ChainRunsService {
    private chainRunRepository;
    private chainRepository;
    private chainsService;
    private chainNodesService;
    private agentRunsService;
    private readonly logger;
    constructor(chainRunRepository: Repository<ChainRunEntity>, chainRepository: Repository<ChainEntity>, chainsService: ChainsService, chainNodesService: ChainNodesService, agentRunsService: AgentRunsService);
    findAll(query: QueryChainRunsDto & {
        userId?: string;
        chainId?: string;
    }): Promise<{
        runs: ChainRunEntity[];
        total: number;
    }>;
    findOne(id: string, userId?: string): Promise<ChainRunEntity>;
    getRunsByChain(chainId: string, skip?: number, limit?: number, userId?: string, status?: string): Promise<{
        runs: ChainRunEntity[];
        total: number;
    }>;
    executeChainRun(chainId: string, userId: string, parameters: Record<string, any>, metadata?: Record<string, any>): Promise<{
        success: boolean;
        output: any;
        executionTime: number;
        runId: string;
        intermediateResults: any[];
    }>;
    private fillPromptTemplate;
}
