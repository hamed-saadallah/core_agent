import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
export declare class EmailVerificationEntity extends BaseEntity {
    code: string;
    expiresAt: Date;
    isVerified: boolean;
    user: UserEntity;
}
