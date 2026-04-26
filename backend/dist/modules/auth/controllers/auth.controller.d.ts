import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ResendCodeDto } from '../dtos/auth.dto';
import { UserEntity } from '../../../infrastructure/database/entities/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: UserEntity;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: UserEntity;
        isEmailVerified: boolean;
    }>;
    verifyEmail(user: UserEntity, verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendCode(resendCodeDto: ResendCodeDto): Promise<{
        message: string;
    }>;
    getCurrentUser(user: UserEntity): Promise<UserEntity>;
}
