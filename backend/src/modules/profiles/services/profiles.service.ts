import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { UpdateProfileDto } from '../dtos/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profilesRepository: Repository<ProfileEntity>,
  ) {}

  async getProfileByUser(user: UserEntity): Promise<ProfileEntity> {
    if (!user.profile) {
      throw new NotFoundException('Profile not found');
    }
    return user.profile;
  }

  async updateProfile(user: UserEntity, updateProfileDto: UpdateProfileDto): Promise<ProfileEntity> {
    if (!user.profile) {
      throw new NotFoundException('Profile not found');
    }

    Object.assign(user.profile, updateProfileDto);
    return this.profilesRepository.save(user.profile);
  }
}
