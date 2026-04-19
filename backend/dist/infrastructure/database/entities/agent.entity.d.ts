import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ToolEntity } from './tool.entity';
import { PromptEntity } from './prompt.entity';
import { AgentRunEntity } from './agent-run.entity';
import { ModelEntity } from './model.entity';
import { SkillEntity } from './skill.entity';
export declare class AgentEntity extends BaseEntity {
    name: string;
    description: string;
    status: string;
    config: Record<string, any>;
    owner: UserEntity;
    ownerId: string;
    tools: ToolEntity[];
    skills: SkillEntity[];
    prompt: PromptEntity;
    promptId: string;
    runs: AgentRunEntity[];
    model: ModelEntity;
    modelId: string;
    temperature: number;
    promptTemplate: string;
}
