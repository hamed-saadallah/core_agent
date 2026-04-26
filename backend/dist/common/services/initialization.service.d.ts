import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlanEntity } from '../../infrastructure/database/entities/plan.entity';
export declare class InitializationService implements OnModuleInit {
    private plansRepository;
    constructor(plansRepository: Repository<PlanEntity>);
    onModuleInit(): Promise<void>;
    private initializeDefaultPlan;
}
