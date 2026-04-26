"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./infrastructure/database/database.module");
const agents_module_1 = require("./agents/agents.module");
const agents_module_2 = require("./modules/agents/agents.module");
const tools_module_1 = require("./modules/tools/tools.module");
const agent_runs_module_1 = require("./modules/agent-runs/agent-runs.module");
const chains_module_1 = require("./modules/chains/chains.module");
const skills_module_1 = require("./modules/skills/skills.module");
const models_module_1 = require("./modules/models/models.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const llm_module_1 = require("./infrastructure/llm/llm.module");
const health_controller_1 = require("./health.controller");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const core_1 = require("@nestjs/core");
const logger_service_1 = require("./common/services/logger.service");
const initialization_service_1 = require("./common/services/initialization.service");
function validateEnv(config) {
    const nodeEnv = String(config.NODE_ENV ?? 'development').trim();
    const jwtSecret = String(config.JWT_SECRET ?? '').trim();
    if (!jwtSecret) {
        throw new Error('Invalid environment: JWT_SECRET is required');
    }
    const databaseUrl = String(config.DATABASE_URL ?? '').trim();
    const hasDbParts = Boolean(String(config.DB_HOST ?? '').trim()) &&
        Boolean(String(config.DB_USERNAME ?? '').trim()) &&
        Boolean(String(config.DB_PASSWORD ?? '').trim()) &&
        Boolean(String(config.DB_NAME ?? '').trim());
    if (nodeEnv === 'production' && !databaseUrl && !hasDbParts) {
        throw new Error('Invalid environment: DATABASE_URL or DB_* variables are required in production');
    }
    const rawExpiration = String(config.JWT_EXPIRATION ?? '3600').trim();
    const isIntegerSeconds = /^\d+$/.test(rawExpiration);
    const isDurationWithUnit = /^\d+(ms|s|m|h|d|w|y)$/i.test(rawExpiration);
    if (!isIntegerSeconds && !isDurationWithUnit) {
        throw new Error('Invalid environment: JWT_EXPIRATION must be integer seconds or a duration string (e.g. 30m, 1h, 7d)');
    }
    return config;
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validate: validateEnv,
            }),
            database_module_1.DatabaseModule,
            llm_module_1.LLMModule,
            agents_module_1.AgentsModule,
            agents_module_2.AgentManagementModule,
            tools_module_1.ToolsManagementModule,
            agent_runs_module_1.AgentRunsModule,
            chains_module_1.ChainsModule,
            skills_module_1.SkillsModule,
            models_module_1.ModelsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            logger_service_1.LoggerService,
            initialization_service_1.InitializationService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
    })
], AppModule);
