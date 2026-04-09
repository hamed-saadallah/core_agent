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

function parseJwtExpiration(raw: string | undefined): string | number {
  if (!raw || raw.trim() === '') {
    return 3600;
  }

  const normalized = raw.trim();
  if (/^\d+$/.test(normalized)) {
    // Numeric env values are treated as seconds.
    return Number(normalized);
  }

  // Duration strings like "30m", "1h", "7d" are supported by jsonwebtoken.
  return normalized;
}

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailVerificationEntity, PlanEntity, ProfileEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseJwtExpiration(configService.get<string>('JWT_EXPIRATION')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, AuthService, EmailService, VerificationService, UsersService],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
