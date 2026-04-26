import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  private parseDatabaseUrl(databaseUrl: string): {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  } {
    // Parse DATABASE_URL format: postgresql://username:password@host:port/database
    const url = new URL(databaseUrl);
    
    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port || '5432', 10),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname?.slice(1) || 'agent_core', // Remove leading slash
    };
  }

  getDatabaseConfig(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    
    // Try to get DATABASE_URL first (Railway format)
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    
    let dbConfig: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };

    if (databaseUrl) {
      // Parse DATABASE_URL if provided (Railway)
      dbConfig = this.parseDatabaseUrl(databaseUrl);
    } else {
      // Fall back to individual environment variables (local development)
      dbConfig = {
        host: this.configService.get<string>('DB_HOST', 'localhost'),
        port: this.configService.get<number>('DB_PORT', 5432),
        username: this.configService.get<string>('DB_USERNAME', 'postgres'),
        password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
        database: this.configService.get<string>('DB_NAME', 'agent_core'),
      };
    }

    // DB_SSL env var: 'true' means enable SSL (default for production)
    const dbSslString = this.configService.get<string>('DB_SSL', isProduction ? 'true' : 'false');
    const sslEnabled = dbSslString === 'true' || dbSslString === '1';

    // Avoid running both synchronize and migrations in dev: both apply schema, so
    // InitialSchema would try CREATE after synchronize already created tables.
    // Production: migrate only, no auto-sync. Dev: sync from entities, no auto-migrate.
    return {
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: !isProduction,
      logging: !isProduction,
      migrationsRun: isProduction,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }
}
