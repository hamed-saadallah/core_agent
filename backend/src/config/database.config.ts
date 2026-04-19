import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    
    // DB_SSL env var: 'true' means enable SSL (default for production)
    const dbSslString = this.configService.get<string>('DB_SSL', isProduction ? 'true' : 'false');
    const sslEnabled = dbSslString === 'true' || dbSslString === '1';

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DB_NAME', 'agent_core'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: !isProduction,
      logging: !isProduction,
      migrationsRun: true,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }
}
