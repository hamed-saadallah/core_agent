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
exports.ChainEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const chain_node_entity_1 = require("./chain-node.entity");
const chain_run_entity_1 = require("./chain-run.entity");
let ChainEntity = class ChainEntity extends base_entity_1.BaseEntity {
};
exports.ChainEntity = ChainEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ChainEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChainEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'active' }),
    __metadata("design:type", String)
], ChainEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChainEntity.prototype, "startingPrompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChainEntity.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.chains, { nullable: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], ChainEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ChainEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chain_node_entity_1.ChainNodeEntity, (node) => node.chain, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], ChainEntity.prototype, "nodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chain_run_entity_1.ChainRunEntity, (run) => run.chain),
    __metadata("design:type", Array)
], ChainEntity.prototype, "runs", void 0);
exports.ChainEntity = ChainEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'chains' }),
    (0, typeorm_1.Unique)(['name', 'ownerId'])
], ChainEntity);
