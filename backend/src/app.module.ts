import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AgentsModule } from './agents/agents.module';
import { AgentManagementModule } from './modules/agents/agents.module';
import { ToolsManagementModule } from './modules/tools/tools.module';
import { AgentRunsModule } from './modules/agent-runs/agent-runs.module';
import { ChainsModule } from './modules/chains/chains.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ModelsModule } from './modules/models/models.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { LLMModule } from './infrastructure/llm/llm.module';
import { HealthController } from './health.controller';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './common/services/logger.service';
import { InitializationService } from './common/services/initialization.service';

function validateEnv(config: Record<string, unknown>) {
  const nodeEnv = String(config.NODE_ENV ?? 'development').trim();

  const jwtSecret = String(config.JWT_SECRET ?? '').trim();
  if (!jwtSecret) {
    throw new Error('Invalid environment: JWT_SECRET is required');
  }

  const databaseUrl = String(config.DATABASE_URL ?? '').trim();
  const hasDbParts =
    Boolean(String(config.DB_HOST ?? '').trim()) &&
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
    throw new Error(
      'Invalid environment: JWT_EXPIRATION must be integer seconds or a duration string (e.g. 30m, 1h, 7d)',
    );
  }

  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    LLMModule,
    AgentsModule,
    AgentManagementModule,
    ToolsManagementModule,
    AgentRunsModule,
    ChainsModule,
    SkillsModule,
    ModelsModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
  ],
  controllers: [HealthController],
  providers: [
    LoggerService,
    InitializationService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
