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
var SkillRunsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRunsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_run_entity_1 = require("../../../infrastructure/database/entities/skill-run.entity");
let SkillRunsService = SkillRunsService_1 = class SkillRunsService {
    constructor(skillRunRepository) {
        this.skillRunRepository = skillRunRepository;
        this.logger = new common_1.Logger(SkillRunsService_1.name);
    }
    async create(skillId, userId, input, metadata) {
        const skillRun = this.skillRunRepository.create({
            skillId,
            userId,
            input,
            status: 'pending',
            metadata,
            retryCount: 0,
        });
        return await this.skillRunRepository.save(skillRun);
    }
    async findOne(id, userId) {
        const run = await this.skillRunRepository.findOne({ where: { id } });
        if (!run) {
            throw new common_1.NotFoundException(`Skill run with ID ${id} not found`);
        }
        if (userId && run.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this skill run');
        }
        return run;
    }
    async findRunsBySkill(skillId, userId, query) {
        const qb = this.skillRunRepository.createQueryBuilder('run').where('run.skillId = :skillId AND run.userId = :userId', {
            skillId,
            userId,
        });
        if (query?.status) {
            qb.andWhere('run.status = :status', { status: query.status });
        }
        const skip = query?.skip || 0;
        const limit = query?.limit || 10;
        const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();
        return { runs, total };
    }
    async findRunsByAgent(agentId, userId, query) {
        const qb = this.skillRunRepository.createQueryBuilder('run').where('run.agentRunId IS NOT NULL AND run.userId = :userId', {
            userId,
        });
        if (query?.status) {
            qb.andWhere('run.status = :status', { status: query.status });
        }
        const skip = query?.skip || 0;
        const limit = query?.limit || 10;
        const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();
        return { runs, total };
    }
    async updateStatus(id, status, output, error, executionTime) {
        const run = await this.findOne(id);
        run.status = status;
        if (output) {
            run.output = output;
        }
        if (error) {
            run.error = error;
        }
        if (executionTime !== undefined) {
            run.executionTime = executionTime;
        }
        return await this.skillRunRepository.save(run);
    }
    async incrementRetry(id) {
        const run = await this.findOne(id);
        run.retryCount += 1;
        return await this.skillRunRepository.save(run);
    }
};
exports.SkillRunsService = SkillRunsService;
exports.SkillRunsService = SkillRunsService = SkillRunsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_run_entity_1.SkillRunEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SkillRunsService);
