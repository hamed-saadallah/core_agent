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
exports.SkillEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const skill_run_entity_1 = require("./skill-run.entity");
const agent_entity_1 = require("./agent.entity");
let SkillEntity = class SkillEntity extends base_entity_1.BaseEntity {
};
exports.SkillEntity = SkillEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SkillEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SkillEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SkillEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SkillEntity.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SkillEntity.prototype, "inputSchema", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SkillEntity.prototype, "outputSchema", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'active' }),
    __metadata("design:type", String)
], SkillEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.skills, { nullable: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], SkillEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SkillEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SkillEntity.prototype, "retryConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], SkillEntity.prototype, "timeout", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => skill_run_entity_1.SkillRunEntity, (run) => run.skill),
    __metadata("design:type", Array)
], SkillEntity.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => agent_entity_1.AgentEntity, (agent) => agent.skills),
    (0, typeorm_1.JoinTable)({ name: 'agent_skills' }),
    __metadata("design:type", Array)
], SkillEntity.prototype, "agents", void 0);
exports.SkillEntity = SkillEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'skills' }),
    (0, typeorm_1.Unique)(['name', 'ownerId']),
    (0, typeorm_1.Index)(['ownerId', 'status'])
], SkillEntity);
