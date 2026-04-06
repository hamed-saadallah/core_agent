import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthStrategy extends Strategy {
  constructor(configService: ConfigService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET'),
      },
      (payload: JwtPayload, done: (err: Error | null, user?: Partial<UserEntity>) => void) => {
        done(null, {
          id: payload.sub,
          email: payload.email,
        });
      },
    );

    this.name = 'jwt';
  }

  validate(payload: JwtPayload): Partial<UserEntity> {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
