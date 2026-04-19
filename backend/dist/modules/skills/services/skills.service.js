"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SkillsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("../../../infrastructure/database/entities/skill.entity");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
let SkillsService = SkillsService_1 = class SkillsService {
    constructor(skillRepository, agentRepository) {
        this.skillRepository = skillRepository;
        this.agentRepository = agentRepository;
        this.logger = new common_1.Logger(SkillsService_1.name);
    }
    async create(createSkillDto, userId) {
        this.logger.log(`Creating skill: ${createSkillDto.name}`);
        const skill = this.skillRepository.create({
            ...createSkillDto,
            ownerId: userId,
            status: 'active',
        });
        try {
            return await this.skillRepository.save(skill);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('A skill with this name already exists for your account');
            }
            throw error;
        }
    }
    async findAll(userId, query) {
        const qb = this.skillRepository.createQueryBuilder('skill');
        if (userId) {
            qb.where('skill.ownerId = :userId', { userId });
        }
        if (query?.status) {
            qb.andWhere('skill.status = :status', { status: query.status });
        }
        if (query?.type) {
            qb.andWhere('skill.type = :type', { type: query.type });
        }
        const skip = query?.skip || 0;
        const limit = query?.limit || 10;
        const [skills, total] = await qb.skip(skip).take(limit).orderBy('skill.createdAt', 'DESC').getManyAndCount();
        return { skills, total };
    }
    async findOne(id, userId) {
        const skill = await this.skillRepository.findOne({
            where: { id },
            relations: ['agents'],
        });
        if (!skill) {
            throw new common_1.NotFoundException(`Skill with ID ${id} not found`);
        }
        if (userId && skill.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this skill');
        }
        return skill;
    }
    async update(id, updateSkillDto, userId) {
        const skill = await this.findOne(id, userId);
        if (updateSkillDto.name) {
            skill.name = updateSkillDto.name;
        }
        if (updateSkillDto.description) {
            skill.description = updateSkillDto.description;
        }
        if (updateSkillDto.config) {
            skill.config = updateSkillDto.config;
        }
        if (updateSkillDto.status) {
            skill.status = updateSkillDto.status;
        }
        if (updateSkillDto.retryConfig) {
            skill.retryConfig = updateSkillDto.retryConfig;
        }
        if (updateSkillDto.timeout !== undefined) {
            skill.timeout = updateSkillDto.timeout;
        }
        try {
            return await this.skillRepository.save(skill);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('A skill with this name already exists for your account');
            }
            throw error;
        }
    }
    async delete(id, userId) {
        const skill = await this.findOne(id, userId);
        await this.skillRepository.remove(skill);
    }
    async assignToAgent(skillId, agentId, userId) {
        this.logger.log(`Assigning skill ${skillId} to agent ${agentId}`);
        const skill = await this.findOne(skillId, userId);
        const agent = await this.agentRepository.findOne({
            where: { id: agentId, ownerId: userId },
            relations: ['skills'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found or you do not have permission to modify it');
        }
        if (!agent.skills) {
            agent.skills = [];
        }
        if (!agent.skills.find((s) => s.id === skillId)) {
            agent.skills.push(skill);
            await this.agentRepository.save(agent);
        }
        return skill;
    }
    async removeFromAgent(skillId, agentId, userId) {
        this.logger.log(`Removing skill ${skillId} from agent ${agentId}`);
        const skill = await this.findOne(skillId, userId);
        const agent = await this.agentRepository.findOne({
            where: { id: agentId, ownerId: userId },
            relations: ['skills'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found or you do not have permission to modify it');
        }
        if (agent.skills) {
            agent.skills = agent.skills.filter((s) => s.id !== skillId);
            await this.agentRepository.save(agent);
        }
    }
    isDuplicateKeyError(error) {
        return error instanceof typeorm_2.QueryFailedError && error.driverError?.code === '23505';
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = SkillsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.SkillEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SkillsService);
