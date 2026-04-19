import { SkillRunEntity } from '@/infrastructure/database/entities/skill-run.entity';
import { SkillEntity } from '@/infrastructure/database/entities/skill.entity';
import { SkillRunsService } from './skill-runs.service';
export declare class SkillExecutorService {
    private skillRunsService;
    private readonly logger;
    constructor(skillRunsService: SkillRunsService);
    executeSkill(skill: SkillEntity, input: Record<string, any>, skillRun: SkillRunEntity): Promise<any>;
    private executeApiCall;
    private executeWebSearch;
    private executeDocumentParse;
    private executeDataTransform;
    private executeExternalService;
    private getNestedValue;
    private delay;
}
