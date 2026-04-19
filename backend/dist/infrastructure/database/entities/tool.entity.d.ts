import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';
export declare class ToolEntity extends BaseEntity {
    name: string;
    description: string;
    schema: Record<string, any>;
    category: string;
    isActive: boolean;
    config: Record<string, any>;
    agents: AgentEntity[];
}
