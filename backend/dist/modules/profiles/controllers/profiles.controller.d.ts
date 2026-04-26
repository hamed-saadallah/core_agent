import { ProfilesService } from '../services/profiles.service';
import { UpdateProfileDto } from '../dtos/profile.dto';
import { UserEntity } from '../../../infrastructure/database/entities/user.entity';
export declare class ProfilesController {
    private profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(user: UserEntity): Promise<import("../../../infrastructure/database/entities/profile.entity").ProfileEntity>;
    updateProfile(user: UserEntity, updateProfileDto: UpdateProfileDto): Promise<import("../../../infrastructure/database/entities/profile.entity").ProfileEntity>;
}
