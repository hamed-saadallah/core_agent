import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { AgentsService } from './services/agents.service';
import { AgentsController } from './controllers/agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity, ToolEntity, PromptEntity])],
  providers: [AgentsService],
  controllers: [AgentsController],
  exports: [AgentsService],
})
export class AgentManagementModule {}
