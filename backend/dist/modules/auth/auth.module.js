"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../infrastructure/database/entities/user.entity");
const email_verification_entity_1 = require("../../infrastructure/database/entities/email-verification.entity");
const plan_entity_1 = require("../../infrastructure/database/entities/plan.entity");
const profile_entity_1 = require("../../infrastructure/database/entities/profile.entity");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const auth_service_1 = require("./services/auth.service");
const email_service_1 = require("./services/email.service");
const verification_service_1 = require("./services/verification.service");
const auth_controller_1 = require("./controllers/auth.controller");
const users_service_1 = require("../users/services/users.service");
function parseJwtExpiration(raw) {
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
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, email_verification_entity_1.EmailVerificationEntity, plan_entity_1.PlanEntity, profile_entity_1.ProfileEntity]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: parseJwtExpiration(configService.get('JWT_EXPIRATION')),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [jwt_strategy_1.JwtAuthStrategy, auth_service_1.AuthService, email_service_1.EmailService, verification_service_1.VerificationService, users_service_1.UsersService],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, passport_1.PassportModule, jwt_1.JwtModule],
    })
], AuthModule);
