import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
export declare class ProfileEntity extends BaseEntity {
    firstName: string;
    lastName: string;
    avatarUrl: string;
    user: UserEntity;
}
