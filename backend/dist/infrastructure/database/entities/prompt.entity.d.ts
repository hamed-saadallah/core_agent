import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
export declare class PromptEntity extends BaseEntity {
    name: string;
    systemPrompt: string;
    userPrompt: string;
    examples: Array<{
        input: string;
        output: string;
    }>;
    version: string;
    creator: UserEntity;
    creatorId: string;
    isActive: boolean;
}
