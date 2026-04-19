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
exports.ChainRunEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const chain_entity_1 = require("./chain.entity");
const user_entity_1 = require("./user.entity");
let ChainRunEntity = class ChainRunEntity extends base_entity_1.BaseEntity {
};
exports.ChainRunEntity = ChainRunEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => chain_entity_1.ChainEntity, (chain) => chain.runs),
    __metadata("design:type", chain_entity_1.ChainEntity)
], ChainRunEntity.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChainRunEntity.prototype, "chainId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], ChainRunEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChainRunEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ChainRunEntity.prototype, "input", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '[]' }),
    __metadata("design:type", Array)
], ChainRunEntity.prototype, "intermediateResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChainRunEntity.prototype, "output", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], ChainRunEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ChainRunEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], ChainRunEntity.prototype, "executionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChainRunEntity.prototype, "metadata", void 0);
exports.ChainRunEntity = ChainRunEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'chain_runs' }),
    (0, typeorm_1.Index)(['chainId', 'createdAt']),
    (0, typeorm_1.Index)(['userId', 'createdAt'])
], ChainRunEntity);
