import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { SkillRunEntity } from './skill-run.entity';
import { AgentEntity } from './agent.entity';
export declare class SkillEntity extends BaseEntity {
    name: string;
    description: string;
    type: 'api_call' | 'web_search' | 'document_parse' | 'data_transform' | 'external_service';
    config: Record<string, any>;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    status: string;
    owner: UserEntity;
    ownerId: string;
    retryConfig: {
        maxRetries: number;
        backoffMs: number;
        retryOn: string[];
    };
    timeout: number;
    runs: SkillRunEntity[];
    agents: AgentEntity[];
}
