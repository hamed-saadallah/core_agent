import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { SkillsService } from '../services/skills.service';
import { SkillExecutorService } from '../services/skill-executor.service';
import { SkillRunsService } from '../services/skill-runs.service';
import { CreateSkillDto, UpdateSkillDto, ExecuteSkillDto } from '../dtos/skill.dto';
export declare class SkillsController {
    private skillsService;
    private skillExecutorService;
    private skillRunsService;
    constructor(skillsService: SkillsService, skillExecutorService: SkillExecutorService, skillRunsService: SkillRunsService);
    getSkills(user: UserEntity, skip?: number, limit?: number, status?: string, type?: string): Promise<{
        skills: import("../../../infrastructure/database/entities/skill.entity").SkillEntity[];
        total: number;
    }>;
    createSkill(createSkillDto: CreateSkillDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/skill.entity").SkillEntity>;
    getSkill(id: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/skill.entity").SkillEntity>;
    updateSkill(id: string, updateSkillDto: UpdateSkillDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/skill.entity").SkillEntity>;
    deleteSkill(id: string, user: UserEntity): Promise<{
        success: boolean;
    }>;
    executeSkill(skillId: string, executeSkillDto: ExecuteSkillDto, user: UserEntity): Promise<{
        success: boolean;
        output: any;
        runId: string;
        executionTime: number;
    }>;
    assignToAgent(skillId: string, agentId: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/skill.entity").SkillEntity>;
    removeFromAgent(skillId: string, agentId: string, user: UserEntity): Promise<{
        success: boolean;
    }>;
    getSkillRuns(skillId: string, user: UserEntity, skip?: number, limit?: number, status?: string): Promise<{
        runs: import("../../../infrastructure/database/entities/skill-run.entity").SkillRunEntity[];
        total: number;
    }>;
    getSkillRun(runId: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/skill-run.entity").SkillRunEntity>;
}
