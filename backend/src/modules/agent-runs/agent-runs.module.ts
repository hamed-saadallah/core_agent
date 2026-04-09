import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { AgentRunsService } from './services/agent-runs.service';
import { AgentRunsController } from './controllers/agent-runs.controller';
import { LLMModule } from '@/infrastructure/llm/llm.module';
import { ModelsModule } from '@/modules/models/models.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentRunEntity, ModelEntity, AgentEntity]),
    LLMModule,
    ModelsModule,
    AuthModule,
  ],
  providers: [AgentRunsService],
  controllers: [AgentRunsController],
  exports: [AgentRunsService],
})
export class AgentRunsModule {}
