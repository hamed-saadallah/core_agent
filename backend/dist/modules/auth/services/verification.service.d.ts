import { Repository } from 'typeorm';
import { EmailVerificationEntity } from '@/infrastructure/database/entities/email-verification.entity';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
export declare class VerificationService {
    private verificationRepository;
    constructor(verificationRepository: Repository<EmailVerificationEntity>);
    generateCode(): string;
    storeVerificationCode(user: UserEntity, code: string): Promise<EmailVerificationEntity>;
    verifyCode(user: UserEntity, code: string): Promise<boolean>;
    isEmailVerified(user: UserEntity): Promise<boolean>;
}
