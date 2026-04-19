import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
export declare class PlanEntity extends BaseEntity {
    name: string;
    maxAgents: number;
    users: UserEntity[];
}
