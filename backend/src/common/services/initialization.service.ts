import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from '@/infrastructure/database/entities/plan.entity';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectRepository(PlanEntity)
    private plansRepository: Repository<PlanEntity>,
  ) {}

  async onModuleInit() {
    await this.initializeDefaultPlan();
  }

  private async initializeDefaultPlan(): Promise<void> {
    try {
      const existingPlan = await this.plansRepository.findOne({
        where: { name: 'Free' },
      });

      if (!existingPlan) {
        const freePlan = this.plansRepository.create({
          name: 'Free',
          maxAgents: 10,
        });

        await this.plansRepository.save(freePlan);
        console.log('Default Free plan created successfully');
      }
    } catch (error) {
      console.error('Failed to initialize default plan:', error);
    }
  }
}
