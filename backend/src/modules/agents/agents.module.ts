import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { AgentsService } from './services/agents.service';
import { AgentsController } from './controllers/agents.controller';
import { ModelsModule } from '@/modules/models/models.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { LLMModule } from '@/infrastructure/llm/llm.module';
import { AgentRunsModule } from '@/modules/agent-runs/agent-runs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, ToolEntity, PromptEntity, AgentRunEntity, ModelEntity]),
    ModelsModule,
    AuthModule,
    LLMModule,
    AgentRunsModule,
  ],
  providers: [AgentsService],
  controllers: [AgentsController],
  exports: [AgentsService],
})
export class AgentManagementModule {}
