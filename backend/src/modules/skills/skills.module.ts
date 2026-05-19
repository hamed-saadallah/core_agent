import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillEntity } from '@/infrastructure/database/entities/skill.entity';
import { SkillRunEntity } from '@/infrastructure/database/entities/skill-run.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { SalesforceCaseSkillModule } from '@/modules/salesforce-cases/salesforce-case-skill.module';
import { ModelsModule } from '@/modules/models/models.module';
import { SkillsService } from './services/skills.service';
import { SkillExecutorService } from './services/skill-executor.service';
import { SkillRunsService } from './services/skill-runs.service';
import { SkillsController } from './controllers/skills.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, SkillRunEntity, AgentEntity]), SalesforceCaseSkillModule, ModelsModule],
  providers: [SkillsService, SkillExecutorService, SkillRunsService],
  controllers: [SkillsController],
  exports: [SkillsService, SkillExecutorService, SkillRunsService],
})
export class SkillsModule {}
