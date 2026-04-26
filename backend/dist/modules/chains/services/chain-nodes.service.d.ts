import { Repository } from 'typeorm';
import { ChainNodeEntity } from '../../../infrastructure/database/entities/chain-node.entity';
import { AgentEntity } from '../../../infrastructure/database/entities/agent.entity';
import { AddChainNodeDto, UpdateChainNodeDto } from '../dtos/chain.dto';
import { ChainsService } from './chains.service';
export declare class ChainNodesService {
    private nodeRepository;
    private agentRepository;
    private chainsService;
    private readonly logger;
    constructor(nodeRepository: Repository<ChainNodeEntity>, agentRepository: Repository<AgentEntity>, chainsService: ChainsService);
    addNode(chainId: string, addNodeDto: AddChainNodeDto, userId: string): Promise<ChainNodeEntity>;
    updateNode(chainId: string, nodeId: string, updateNodeDto: UpdateChainNodeDto, userId: string): Promise<ChainNodeEntity>;
    removeNode(chainId: string, nodeId: string, userId: string): Promise<void>;
    getNodesByChain(chainId: string): Promise<ChainNodeEntity[]>;
}
