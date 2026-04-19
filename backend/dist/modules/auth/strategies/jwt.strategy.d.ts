import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
export interface JwtPayload {
    sub: string;
    email: string;
}
declare const JwtAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Partial<UserEntity>;
}
export {};
