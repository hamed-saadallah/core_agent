import { BaseEntity } from './base.entity';
import { ChainEntity } from './chain.entity';
import { AgentEntity } from './agent.entity';
export declare class ChainNodeEntity extends BaseEntity {
    chain: ChainEntity;
    chainId: string;
    agent: AgentEntity;
    agentId: string;
    order: number;
    nodeConfig: Record<string, any>;
}
