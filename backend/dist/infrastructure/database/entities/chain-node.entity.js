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
exports.ChainNodeEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const chain_entity_1 = require("./chain.entity");
const agent_entity_1 = require("./agent.entity");
let ChainNodeEntity = class ChainNodeEntity extends base_entity_1.BaseEntity {
};
exports.ChainNodeEntity = ChainNodeEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => chain_entity_1.ChainEntity, (chain) => chain.nodes, { onDelete: 'CASCADE' }),
    __metadata("design:type", chain_entity_1.ChainEntity)
], ChainNodeEntity.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChainNodeEntity.prototype, "chainId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.AgentEntity, { eager: true }),
    __metadata("design:type", agent_entity_1.AgentEntity)
], ChainNodeEntity.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChainNodeEntity.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], ChainNodeEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ChainNodeEntity.prototype, "nodeConfig", void 0);
exports.ChainNodeEntity = ChainNodeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'chain_nodes' }),
    (0, typeorm_1.Index)(['chainId', 'order'])
], ChainNodeEntity);
