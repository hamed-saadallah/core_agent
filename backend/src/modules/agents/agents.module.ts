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

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, ToolEntity, PromptEntity, AgentRunEntity, ModelEntity]),
    ModelsModule,
  ],
  providers: [AgentsService],
  controllers: [AgentsController],
  exports: [AgentsService],
})
export class AgentManagementModule {}
