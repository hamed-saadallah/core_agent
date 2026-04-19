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
exports.ModelEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const agent_entity_1 = require("./agent.entity");
let ModelEntity = class ModelEntity extends base_entity_1.BaseEntity {
};
exports.ModelEntity = ModelEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ModelEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ModelEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ModelEntity.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'enabled' }),
    __metadata("design:type", String)
], ModelEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        default: 0.7,
        transformer: { to: (v) => v, from: (v) => parseFloat(v) },
    }),
    __metadata("design:type", Number)
], ModelEntity.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.models, { nullable: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], ModelEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ModelEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agent_entity_1.AgentEntity, (agent) => agent.model),
    __metadata("design:type", Array)
], ModelEntity.prototype, "agents", void 0);
exports.ModelEntity = ModelEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'models' }),
    (0, typeorm_1.Unique)(['name', 'ownerId'])
], ModelEntity);
