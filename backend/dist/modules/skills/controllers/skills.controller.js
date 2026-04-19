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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const all_exceptions_filter_1 = require("../../../common/filters/all-exceptions.filter");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const skills_service_1 = require("../services/skills.service");
const skill_executor_service_1 = require("../services/skill-executor.service");
const skill_runs_service_1 = require("../services/skill-runs.service");
const skill_dto_1 = require("../dtos/skill.dto");
let SkillsController = class SkillsController {
    constructor(skillsService, skillExecutorService, skillRunsService) {
        this.skillsService = skillsService;
        this.skillExecutorService = skillExecutorService;
        this.skillRunsService = skillRunsService;
    }
    async getSkills(user, skip, limit, status, type) {
        return await this.skillsService.findAll(user.id, {
            skip: skip || 0,
            limit: limit || 10,
            status,
            type,
        });
    }
    async createSkill(createSkillDto, user) {
        return await this.skillsService.create(createSkillDto, user.id);
    }
    async getSkill(id, user) {
        return await this.skillsService.findOne(id, user.id);
    }
    async updateSkill(id, updateSkillDto, user) {
        return await this.skillsService.update(id, updateSkillDto, user.id);
    }
    async deleteSkill(id, user) {
        await this.skillsService.delete(id, user.id);
        return { success: true };
    }
    async executeSkill(skillId, executeSkillDto, user) {
        // Get the skill
        const skill = await this.skillsService.findOne(skillId, user.id);
        // Create a skill run record
        const skillRun = await this.skillRunsService.create(skillId, user.id, executeSkillDto.input, executeSkillDto.metadata);
        // Execute the skill
        const output = await this.skillExecutorService.executeSkill(skill, executeSkillDto.input, skillRun);
        // Get the updated run
        const updatedRun = await this.skillRunsService.findOne(skillRun.id, user.id);
        return {
            success: true,
            output,
            runId: updatedRun.id,
            executionTime: updatedRun.executionTime,
        };
    }
    async assignToAgent(skillId, agentId, user) {
        return await this.skillsService.assignToAgent(skillId, agentId, user.id);
    }
    async removeFromAgent(skillId, agentId, user) {
        await this.skillsService.removeFromAgent(skillId, agentId, user.id);
        return { success: true };
    }
    async getSkillRuns(skillId, user, skip, limit, status) {
        return await this.skillRunsService.findRunsBySkill(skillId, user.id, {
            skip: skip || 0,
            limit: limit || 10,
            status,
        });
    }
    async getSkillRun(runId, user) {
        return await this.skillRunsService.findOne(runId, user.id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getSkills", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [skill_dto_1.CreateSkillDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "createSkill", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getSkill", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, skill_dto_1.UpdateSkillDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "updateSkill", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "deleteSkill", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, skill_dto_1.ExecuteSkillDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "executeSkill", null);
__decorate([
    (0, common_1.Post)(':id/agents/:agentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('agentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "assignToAgent", null);
__decorate([
    (0, common_1.Delete)(':id/agents/:agentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('agentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "removeFromAgent", null);
__decorate([
    (0, common_1.Get)(':id/runs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity, Number, Number, String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getSkillRuns", null);
__decorate([
    (0, common_1.Get)('runs/:runId'),
    __param(0, (0, common_1.Param)('runId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getSkillRun", null);
exports.SkillsController = SkillsController = __decorate([
    (0, common_1.Controller)('skills'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseFilters)(all_exceptions_filter_1.AllExceptionsFilter),
    __metadata("design:paramtypes", [skills_service_1.SkillsService,
        skill_executor_service_1.SkillExecutorService,
        skill_runs_service_1.SkillRunsService])
], SkillsController);
