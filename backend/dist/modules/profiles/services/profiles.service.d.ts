import { Repository } from 'typeorm';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { UpdateProfileDto } from '../dtos/profile.dto';
export declare class ProfilesService {
    private profilesRepository;
    constructor(profilesRepository: Repository<ProfileEntity>);
    getProfileByUser(user: UserEntity): Promise<ProfileEntity>;
    updateProfile(user: UserEntity, updateProfileDto: UpdateProfileDto): Promise<ProfileEntity>;
}
