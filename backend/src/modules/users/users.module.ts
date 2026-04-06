import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { PlanEntity } from '@/infrastructure/database/entities/plan.entity';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlanEntity, ProfileEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
