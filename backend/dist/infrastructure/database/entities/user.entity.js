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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const agent_entity_1 = require("./agent.entity");
const model_entity_1 = require("./model.entity");
const profile_entity_1 = require("./profile.entity");
const plan_entity_1 = require("./plan.entity");
const chain_entity_1 = require("./chain.entity");
const skill_entity_1 = require("./skill.entity");
let UserEntity = class UserEntity extends base_entity_1.BaseEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_entity_1.ProfileEntity, (profile) => profile.user, { eager: true, cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", profile_entity_1.ProfileEntity)
], UserEntity.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plan_entity_1.PlanEntity, (plan) => plan.users),
    __metadata("design:type", plan_entity_1.PlanEntity)
], UserEntity.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agent_entity_1.AgentEntity, (agent) => agent.owner),
    __metadata("design:type", Array)
], UserEntity.prototype, "agents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chain_entity_1.ChainEntity, (chain) => chain.owner),
    __metadata("design:type", Array)
], UserEntity.prototype, "chains", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => skill_entity_1.SkillEntity, (skill) => skill.owner),
    __metadata("design:type", Array)
], UserEntity.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_entity_1.ModelEntity, (model) => model.owner),
    __metadata("design:type", Array)
], UserEntity.prototype, "models", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], UserEntity);
