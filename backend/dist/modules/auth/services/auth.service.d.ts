import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from './email.service';
import { VerificationService } from './verification.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ResendCodeDto } from '../dtos/auth.dto';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private verificationService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, verificationService: VerificationService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: UserEntity;
        isEmailVerified: boolean;
    }>;
    verifyEmail(userId: string, verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendCode(resendCodeDto: ResendCodeDto): Promise<{
        message: string;
    }>;
}
