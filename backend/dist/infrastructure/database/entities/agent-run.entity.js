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
exports.AgentRunEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const agent_entity_1 = require("./agent.entity");
const user_entity_1 = require("./user.entity");
let AgentRunEntity = class AgentRunEntity extends base_entity_1.BaseEntity {
};
exports.AgentRunEntity = AgentRunEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.AgentEntity, (agent) => agent.runs),
    __metadata("design:type", agent_entity_1.AgentEntity)
], AgentRunEntity.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AgentRunEntity.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], AgentRunEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AgentRunEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], AgentRunEntity.prototype, "input", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AgentRunEntity.prototype, "output", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], AgentRunEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AgentRunEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AgentRunEntity.prototype, "executionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AgentRunEntity.prototype, "metadata", void 0);
exports.AgentRunEntity = AgentRunEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'agent_runs' }),
    (0, typeorm_1.Index)(['agentId', 'createdAt']),
    (0, typeorm_1.Index)(['userId', 'createdAt'])
], AgentRunEntity);
