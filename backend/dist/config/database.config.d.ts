import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare class DatabaseConfigService {
    private configService;
    constructor(configService: ConfigService);
    getDatabaseConfig(): TypeOrmModuleOptions;
}
