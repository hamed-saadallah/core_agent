import { BaseEntity } from './base.entity';
import { SkillEntity } from './skill.entity';
import { UserEntity } from './user.entity';
import { AgentRunEntity } from './agent-run.entity';
export declare class SkillRunEntity extends BaseEntity {
    skill: SkillEntity;
    skillId: string;
    agentRun: AgentRunEntity;
    agentRunId: string;
    user: UserEntity;
    userId: string;
    input: Record<string, any>;
    output: Record<string, any>;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'retried';
    error: string;
    executionTime: number;
    retryCount: number;
    metadata: Record<string, any>;
}
