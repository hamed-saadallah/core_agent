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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DatabaseConfigService = class DatabaseConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    parseDatabaseUrl(databaseUrl) {
        // Parse DATABASE_URL format: postgresql://username:password@host:port/database
        const url = new URL(databaseUrl);
        return {
            host: url.hostname || 'localhost',
            port: parseInt(url.port || '5432', 10),
            username: url.username || 'postgres',
            password: url.password || 'postgres',
            database: url.pathname?.slice(1) || 'agent_core', // Remove leading slash
        };
    }
    getDatabaseConfig() {
        const nodeEnv = this.configService.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';
        // Try to get DATABASE_URL first (Railway format)
        const databaseUrl = this.configService.get('DATABASE_URL');
        let dbConfig;
        if (databaseUrl) {
            // Parse DATABASE_URL if provided (Railway)
            dbConfig = this.parseDatabaseUrl(databaseUrl);
        }
        else {
            // Fall back to individual environment variables (local development)
            dbConfig = {
                host: this.configService.get('DB_HOST', 'localhost'),
                port: this.configService.get('DB_PORT', 5432),
                username: this.configService.get('DB_USERNAME', 'postgres'),
                password: this.configService.get('DB_PASSWORD', 'postgres'),
                database: this.configService.get('DB_NAME', 'agent_core'),
            };
        }
        // DB_SSL env var: 'true' means enable SSL (default for production)
        const dbSslString = this.configService.get('DB_SSL', isProduction ? 'true' : 'false');
        const sslEnabled = dbSslString === 'true' || dbSslString === '1';
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
            migrationsRun: true,
            ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
    }
};
exports.DatabaseConfigService = DatabaseConfigService;
exports.DatabaseConfigService = DatabaseConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseConfigService);
