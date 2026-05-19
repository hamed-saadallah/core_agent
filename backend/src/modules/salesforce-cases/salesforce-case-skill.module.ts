import { Module } from '@nestjs/common';
import { SalesforceCaseSkillService } from './services/salesforce-case-skill.service';

@Module({
  providers: [SalesforceCaseSkillService],
  exports: [SalesforceCaseSkillService],
})
export class SalesforceCaseSkillModule {}
