import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AgentsModule } from './agents/agents.module';
import { AgentManagementModule } from './modules/agents/agents.module';
import { ToolsManagementModule } from './modules/tools/tools.module';
import { AgentRunsModule } from './modules/agent-runs/agent-runs.module';
import { ModelsModule } from './modules/models/models.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { HealthController } from './health.controller';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './common/services/logger.service';
import { InitializationService } from './common/services/initialization.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AgentsModule,
    AgentManagementModule,
    ToolsManagementModule,
    AgentRunsModule,
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
