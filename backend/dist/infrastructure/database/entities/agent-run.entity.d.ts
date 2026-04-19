import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';
import { UserEntity } from './user.entity';
export declare class AgentRunEntity extends BaseEntity {
    agent: AgentEntity;
    agentId: string;
    user: UserEntity;
    userId: string;
    input: Record<string, any>;
    output: Record<string, any>;
    status: string;
    error: string;
    executionTime: number;
    metadata: Record<string, any>;
}
