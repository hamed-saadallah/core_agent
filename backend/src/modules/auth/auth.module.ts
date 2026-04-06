import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { EmailVerificationEntity } from '@/infrastructure/database/entities/email-verification.entity';
import { PlanEntity } from '@/infrastructure/database/entities/plan.entity';
import { ProfileEntity } from '@/infrastructure/database/entities/profile.entity';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { VerificationService } from './services/verification.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailVerificationEntity, PlanEntity, ProfileEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION', 3600),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, AuthService, EmailService, VerificationService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
