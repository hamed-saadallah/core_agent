import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { AgentEntity } from './agent.entity';
export declare class ModelEntity extends BaseEntity {
    name: string;
    version: string;
    apiKey: string;
    status: string;
    temperature: number;
    owner: UserEntity;
    ownerId: string;
    agents: AgentEntity[];
}
