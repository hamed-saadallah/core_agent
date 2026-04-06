import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { PlanEntity } from '@/infrastructure/database/entities/plan.entity';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(PlanEntity)
    private plansRepository: Repository<PlanEntity>,
    @InjectRepository(ProfileEntity)
    private profilesRepository: Repository<ProfileEntity>,
  ) {}

  async createUser(email: string, password: string): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultPlan = await this.plansRepository.findOne({
      where: { name: 'Free' },
    });

    const profile = this.profilesRepository.create({});
    await this.profilesRepository.save(profile);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      profile,
      plan: defaultPlan,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile', 'plan'],
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'plan'],
    });
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async updateEmailVerification(user: UserEntity, isVerified: boolean): Promise<UserEntity> {
    user.isEmailVerified = isVerified;
    return this.usersRepository.save(user);
  }
}
