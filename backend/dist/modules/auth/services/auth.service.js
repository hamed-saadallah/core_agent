"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/services/users.service");
const email_service_1 = require("./email.service");
const verification_service_1 = require("./verification.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, emailService, verificationService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.verificationService = verificationService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(registerDto) {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
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
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await this.usersService.validatePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const access_token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        if (process.env.NODE_ENV !== 'production') {
            const decoded = this.jwtService.decode(access_token);
            const now = Math.floor(Date.now() / 1000);
            const expiresAt = decoded?.exp ?? null;
            const ttlSeconds = typeof expiresAt === 'number' ? expiresAt - now : null;
            this.logger.log(`Issued JWT for ${user.email} (exp=${expiresAt ?? 'n/a'}, ttlSeconds=${ttlSeconds ?? 'n/a'})`);
        }
        return {
            access_token,
            user,
            isEmailVerified: user.isEmailVerified,
        };
    }
    async verifyEmail(userId, verifyEmailDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isValid = await this.verificationService.verifyCode(user, verifyEmailDto.code);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        await this.usersService.updateEmailVerification(user, true);
        return {
            message: 'Email verified successfully',
        };
    }
    async resendCode(resendCodeDto) {
        const user = await this.usersService.findByEmail(resendCodeDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const code = this.verificationService.generateCode();
        await this.verificationService.storeVerificationCode(user, code);
        await this.emailService.sendVerificationEmail(user.email, code);
        return {
            message: 'Verification code resent',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        verification_service_1.VerificationService])
], AuthService);
