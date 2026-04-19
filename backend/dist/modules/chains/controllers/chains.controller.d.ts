import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { ChainsService } from '../services/chains.service';
import { ChainNodesService } from '../services/chain-nodes.service';
import { ChainRunsService } from '../services/chain-runs.service';
import { CreateChainDto, UpdateChainDto, AddChainNodeDto, UpdateChainNodeDto, ExecuteChainDto } from '../dtos/chain.dto';
export declare class ChainsController {
    private chainsService;
    private chainNodesService;
    private chainRunsService;
    constructor(chainsService: ChainsService, chainNodesService: ChainNodesService, chainRunsService: ChainRunsService);
    getChains(user: UserEntity, skip?: number, limit?: number, status?: string): Promise<{
        chains: import("../../../infrastructure/database/entities/chain.entity").ChainEntity[];
        total: number;
    }>;
    createChain(createChainDto: CreateChainDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain.entity").ChainEntity>;
    getChain(id: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain.entity").ChainEntity>;
    updateChain(id: string, updateChainDto: UpdateChainDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain.entity").ChainEntity>;
    deleteChain(id: string, user: UserEntity): Promise<{
        success: boolean;
    }>;
    addNode(chainId: string, addNodeDto: AddChainNodeDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain-node.entity").ChainNodeEntity>;
    updateNode(chainId: string, nodeId: string, updateNodeDto: UpdateChainNodeDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain-node.entity").ChainNodeEntity>;
    removeNode(chainId: string, nodeId: string, user: UserEntity): Promise<{
        success: boolean;
    }>;
    executeChain(id: string, executeChainDto: ExecuteChainDto, user: UserEntity): Promise<{
        success: boolean;
        output: any;
        executionTime: number;
        runId: string;
        intermediateResults: any[];
    }>;
    getChainRuns(chainId: string, user: UserEntity, skip?: number, limit?: number, status?: string): Promise<{
        runs: import("../../../infrastructure/database/entities/chain-run.entity").ChainRunEntity[];
        total: number;
    }>;
    getChainRun(runId: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/chain-run.entity").ChainRunEntity>;
}
