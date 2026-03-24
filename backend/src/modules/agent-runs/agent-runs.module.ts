import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { AgentRunsService } from './services/agent-runs.service';
import { AgentRunsController } from './controllers/agent-runs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentRunEntity])],
  providers: [AgentRunsService],
  controllers: [AgentRunsController],
  exports: [AgentRunsService],
})
export class AgentRunsModule {}
