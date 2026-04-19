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
exports.ChainsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const all_exceptions_filter_1 = require("../../../common/filters/all-exceptions.filter");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
const chains_service_1 = require("../services/chains.service");
const chain_nodes_service_1 = require("../services/chain-nodes.service");
const chain_runs_service_1 = require("../services/chain-runs.service");
const chain_dto_1 = require("../dtos/chain.dto");
let ChainsController = class ChainsController {
    constructor(chainsService, chainNodesService, chainRunsService) {
        this.chainsService = chainsService;
        this.chainNodesService = chainNodesService;
        this.chainRunsService = chainRunsService;
    }
    async getChains(user, skip, limit, status) {
        return await this.chainsService.findAll(user.id, {
            skip: skip || 0,
            limit: limit || 10,
            status,
        });
    }
    async createChain(createChainDto, user) {
        return await this.chainsService.create(createChainDto, user.id);
    }
    async getChain(id, user) {
        return await this.chainsService.findOne(id, user.id);
    }
    async updateChain(id, updateChainDto, user) {
        return await this.chainsService.update(id, updateChainDto, user.id);
    }
    async deleteChain(id, user) {
        await this.chainsService.delete(id, user.id);
        return { success: true };
    }
    async addNode(chainId, addNodeDto, user) {
        return await this.chainNodesService.addNode(chainId, addNodeDto, user.id);
    }
    async updateNode(chainId, nodeId, updateNodeDto, user) {
        return await this.chainNodesService.updateNode(chainId, nodeId, updateNodeDto, user.id);
    }
    async removeNode(chainId, nodeId, user) {
        await this.chainNodesService.removeNode(chainId, nodeId, user.id);
        return { success: true };
    }
    async executeChain(id, executeChainDto, user) {
        return await this.chainRunsService.executeChainRun(id, user.id, executeChainDto.parameters, executeChainDto.metadata);
    }
    async getChainRuns(chainId, user, skip, limit, status) {
        return await this.chainRunsService.getRunsByChain(chainId, skip || 0, limit || 10, user.id, status);
    }
    async getChainRun(runId, user) {
        return await this.chainRunsService.findOne(runId, user.id);
    }
};
exports.ChainsController = ChainsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "getChains", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chain_dto_1.CreateChainDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "createChain", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "getChain", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chain_dto_1.UpdateChainDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "updateChain", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "deleteChain", null);
__decorate([
    (0, common_1.Post)(':id/nodes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chain_dto_1.AddChainNodeDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "addNode", null);
__decorate([
    (0, common_1.Put)(':id/nodes/:nodeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('nodeId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, chain_dto_1.UpdateChainNodeDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "updateNode", null);
__decorate([
    (0, common_1.Delete)(':id/nodes/:nodeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('nodeId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "removeNode", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chain_dto_1.ExecuteChainDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "executeChain", null);
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
], ChainsController.prototype, "getChainRuns", null);
__decorate([
    (0, common_1.Get)('runs/:runId'),
    __param(0, (0, common_1.Param)('runId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ChainsController.prototype, "getChainRun", null);
exports.ChainsController = ChainsController = __decorate([
    (0, common_1.Controller)('chains'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseFilters)(all_exceptions_filter_1.AllExceptionsFilter),
    __metadata("design:paramtypes", [chains_service_1.ChainsService,
        chain_nodes_service_1.ChainNodesService,
        chain_runs_service_1.ChainRunsService])
], ChainsController);
