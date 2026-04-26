import { Repository } from 'typeorm';
import { SkillEntity } from '../../../infrastructure/database/entities/skill.entity';
import { AgentEntity } from '../../../infrastructure/database/entities/agent.entity';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from '../dtos/skill.dto';
export declare class SkillsService {
    private skillRepository;
    private agentRepository;
    private readonly logger;
    constructor(skillRepository: Repository<SkillEntity>, agentRepository: Repository<AgentEntity>);
    create(createSkillDto: CreateSkillDto, userId: string): Promise<SkillEntity>;
    findAll(userId?: string, query?: QuerySkillsDto): Promise<{
        skills: SkillEntity[];
        total: number;
    }>;
    findOne(id: string, userId?: string): Promise<SkillEntity>;
    update(id: string, updateSkillDto: UpdateSkillDto, userId?: string): Promise<SkillEntity>;
    delete(id: string, userId?: string): Promise<void>;
    assignToAgent(skillId: string, agentId: string, userId: string): Promise<SkillEntity>;
    removeFromAgent(skillId: string, agentId: string, userId: string): Promise<void>;
    private isDuplicateKeyError;
}
