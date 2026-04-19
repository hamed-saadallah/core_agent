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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRunEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const skill_entity_1 = require("./skill.entity");
const user_entity_1 = require("./user.entity");
const agent_run_entity_1 = require("./agent-run.entity");
let SkillRunEntity = class SkillRunEntity extends base_entity_1.BaseEntity {
};
exports.SkillRunEntity = SkillRunEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.SkillEntity, (skill) => skill.runs),
    __metadata("design:type", skill_entity_1.SkillEntity)
], SkillRunEntity.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SkillRunEntity.prototype, "skillId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_run_entity_1.AgentRunEntity, { nullable: true }),
    __metadata("design:type", agent_run_entity_1.AgentRunEntity)
], SkillRunEntity.prototype, "agentRun", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SkillRunEntity.prototype, "agentRunId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], SkillRunEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SkillRunEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SkillRunEntity.prototype, "input", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SkillRunEntity.prototype, "output", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], SkillRunEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SkillRunEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], SkillRunEntity.prototype, "executionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], SkillRunEntity.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SkillRunEntity.prototype, "metadata", void 0);
exports.SkillRunEntity = SkillRunEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'skill_runs' }),
    (0, typeorm_1.Index)(['skillId', 'createdAt']),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['agentRunId'])
], SkillRunEntity);
