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
exports.AgentEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const tool_entity_1 = require("./tool.entity");
const prompt_entity_1 = require("./prompt.entity");
const agent_run_entity_1 = require("./agent-run.entity");
const model_entity_1 = require("./model.entity");
const skill_entity_1 = require("./skill.entity");
let AgentEntity = class AgentEntity extends base_entity_1.BaseEntity {
};
exports.AgentEntity = AgentEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AgentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AgentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'active' }),
    __metadata("design:type", String)
], AgentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AgentEntity.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.agents, { nullable: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], AgentEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AgentEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tool_entity_1.ToolEntity, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'agent_tools' }),
    __metadata("design:type", Array)
], AgentEntity.prototype, "tools", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.SkillEntity, (skill) => skill.agents),
    __metadata("design:type", Array)
], AgentEntity.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prompt_entity_1.PromptEntity, { eager: true }),
    __metadata("design:type", prompt_entity_1.PromptEntity)
], AgentEntity.prototype, "prompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AgentEntity.prototype, "promptId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agent_run_entity_1.AgentRunEntity, (run) => run.agent),
    __metadata("design:type", Array)
], AgentEntity.prototype, "runs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_entity_1.ModelEntity, (model) => model.agents, { nullable: true }),
    __metadata("design:type", model_entity_1.ModelEntity)
], AgentEntity.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AgentEntity.prototype, "modelId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        default: 0.7,
        transformer: { to: (v) => v, from: (v) => parseFloat(v) },
    }),
    __metadata("design:type", Number)
], AgentEntity.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AgentEntity.prototype, "promptTemplate", void 0);
exports.AgentEntity = AgentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'agents' }),
    (0, typeorm_1.Unique)(['name', 'ownerId'])
], AgentEntity);
