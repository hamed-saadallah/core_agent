import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from './email.service';
import { VerificationService } from './verification.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ResendCodeDto } from '../dtos/auth.dto';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private verificationService: VerificationService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: UserEntity }> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.createUser(registerDto.email, registerDto.password);

    const code = this.verificationService.generateCode();
    await this.verificationService.storeVerificationCode(user, code);
    await this.emailService.sendVerificationEmail(user.email, code);

    return {
      message: 'User registered successfully. Verification email sent.',
      user,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: UserEntity; isEmailVerified: boolean }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.usersService.validatePassword(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      user,
      isEmailVerified: user.isEmailVerified,
    };
  }

  async verifyEmail(userId: string, verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.verificationService.verifyCode(user, verifyEmailDto.code);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.usersService.updateEmailVerification(user, true);

    return {
      message: 'Email verified successfully',
    };
  }

  async resendCode(resendCodeDto: ResendCodeDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(resendCodeDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const code = this.verificationService.generateCode();
    await this.verificationService.storeVerificationCode(user, code);
    await this.emailService.sendVerificationEmail(user.email, code);

    return {
      message: 'Verification code resent',
    };
  }
}
