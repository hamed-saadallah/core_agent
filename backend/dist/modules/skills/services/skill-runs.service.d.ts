import { Repository } from 'typeorm';
import { SkillRunEntity } from '@/infrastructure/database/entities/skill-run.entity';
import { QuerySkillsDto } from '../dtos/skill.dto';
export declare class SkillRunsService {
    private skillRunRepository;
    private readonly logger;
    constructor(skillRunRepository: Repository<SkillRunEntity>);
    create(skillId: string, userId: string, input: Record<string, any>, metadata?: Record<string, any>): Promise<SkillRunEntity>;
    findOne(id: string, userId?: string): Promise<SkillRunEntity>;
    findRunsBySkill(skillId: string, userId: string, query?: QuerySkillsDto): Promise<{
        runs: SkillRunEntity[];
        total: number;
    }>;
    findRunsByAgent(agentId: string, userId: string, query?: QuerySkillsDto): Promise<{
        runs: SkillRunEntity[];
        total: number;
    }>;
    updateStatus(id: string, status: string, output?: any, error?: string, executionTime?: number): Promise<SkillRunEntity>;
    incrementRetry(id: string): Promise<SkillRunEntity>;
}
