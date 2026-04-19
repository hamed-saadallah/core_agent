import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';
import { ModelEntity } from './model.entity';
import { ProfileEntity } from './profile.entity';
import { PlanEntity } from './plan.entity';
import { ChainEntity } from './chain.entity';
import { SkillEntity } from './skill.entity';
export declare class UserEntity extends BaseEntity {
    email: string;
    password: string;
    isEmailVerified: boolean;
    isActive: boolean;
    profile: ProfileEntity;
    plan: PlanEntity;
    agents: AgentEntity[];
    chains: ChainEntity[];
    skills: SkillEntity[];
    models: ModelEntity[];
}
