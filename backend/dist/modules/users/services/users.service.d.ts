import { Repository } from 'typeorm';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { PlanEntity } from '@/infrastructure/database/entities/plan.entity';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
export declare class UsersService {
    private usersRepository;
    private plansRepository;
    private profilesRepository;
    constructor(usersRepository: Repository<UserEntity>, plansRepository: Repository<PlanEntity>, profilesRepository: Repository<ProfileEntity>);
    createUser(email: string, password: string): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    validatePassword(password: string, hash: string): Promise<boolean>;
    updateEmailVerification(user: UserEntity, isVerified: boolean): Promise<UserEntity>;
}
