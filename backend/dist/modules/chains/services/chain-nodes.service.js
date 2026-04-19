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
var ChainNodesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainNodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chain_node_entity_1 = require("../../../infrastructure/database/entities/chain-node.entity");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
const chains_service_1 = require("./chains.service");
let ChainNodesService = ChainNodesService_1 = class ChainNodesService {
    constructor(nodeRepository, agentRepository, chainsService) {
        this.nodeRepository = nodeRepository;
        this.agentRepository = agentRepository;
        this.chainsService = chainsService;
        this.logger = new common_1.Logger(ChainNodesService_1.name);
    }
    async addNode(chainId, addNodeDto, userId) {
        this.logger.log(`Adding node to chain: ${chainId}`);
        // Verify chain exists and user owns it
        await this.chainsService.findOne(chainId, userId);
        // Verify agent exists
        const agent = await this.agentRepository.findOne({
            where: { id: addNodeDto.agentId },
        });
        if (!agent) {
            throw new common_1.BadRequestException(`Agent with ID ${addNodeDto.agentId} not found`);
        }
        // Reorder nodes if necessary
        const existingNodes = await this.nodeRepository.find({
            where: { chainId },
            order: { order: 'ASC' },
        });
        if (addNodeDto.order > existingNodes.length) {
            throw new common_1.BadRequestException(`Order ${addNodeDto.order} is out of bounds. Valid range: 0-${existingNodes.length}`);
        }
        if (addNodeDto.order < existingNodes.length) {
            await this.nodeRepository
                .createQueryBuilder()
                .update(chain_node_entity_1.ChainNodeEntity)
                .set({ order: () => 'order + 1' })
                .where('chainId = :chainId AND order >= :order', { chainId, order: addNodeDto.order })
                .execute();
        }
        const node = this.nodeRepository.create({
            chainId,
            agentId: addNodeDto.agentId,
            order: addNodeDto.order,
            nodeConfig: addNodeDto.nodeConfig || {},
        });
        return await this.nodeRepository.save(node);
    }
    async updateNode(chainId, nodeId, updateNodeDto, userId) {
        this.logger.log(`Updating node: ${nodeId} in chain: ${chainId}`);
        // Verify chain exists and user owns it
        await this.chainsService.findOne(chainId, userId);
        const node = await this.nodeRepository.findOne({
            where: { id: nodeId, chainId },
        });
        if (!node) {
            throw new common_1.NotFoundException(`Node with ID ${nodeId} not found in chain ${chainId}`);
        }
        if (updateNodeDto.order !== undefined && updateNodeDto.order !== node.order) {
            // Handle reordering
            const allNodes = await this.nodeRepository.find({
                where: { chainId },
                order: { order: 'ASC' },
            });
            if (updateNodeDto.order > allNodes.length - 1) {
                throw new common_1.BadRequestException(`Order ${updateNodeDto.order} is out of bounds`);
            }
            const currentOrder = node.order;
            const newOrder = updateNodeDto.order;
            if (newOrder > currentOrder) {
                // Moving down
                await this.nodeRepository
                    .createQueryBuilder()
                    .update(chain_node_entity_1.ChainNodeEntity)
                    .set({ order: () => 'order - 1' })
                    .where('chainId = :chainId AND order > :currentOrder AND order <= :newOrder', { chainId, currentOrder, newOrder })
                    .execute();
            }
            else {
                // Moving up
                await this.nodeRepository
                    .createQueryBuilder()
                    .update(chain_node_entity_1.ChainNodeEntity)
                    .set({ order: () => 'order + 1' })
                    .where('chainId = :chainId AND order >= :newOrder AND order < :currentOrder', { chainId, newOrder, currentOrder })
                    .execute();
            }
            node.order = newOrder;
        }
        if (updateNodeDto.nodeConfig !== undefined) {
            node.nodeConfig = updateNodeDto.nodeConfig;
        }
        return await this.nodeRepository.save(node);
    }
    async removeNode(chainId, nodeId, userId) {
        this.logger.log(`Removing node: ${nodeId} from chain: ${chainId}`);
        // Verify chain exists and user owns it
        await this.chainsService.findOne(chainId, userId);
        const node = await this.nodeRepository.findOne({
            where: { id: nodeId, chainId },
        });
        if (!node) {
            throw new common_1.NotFoundException(`Node with ID ${nodeId} not found in chain ${chainId}`);
        }
        const nodeOrder = node.order;
        // Remove the node
        await this.nodeRepository.remove(node);
        // Reorder remaining nodes
        await this.nodeRepository
            .createQueryBuilder()
            .update(chain_node_entity_1.ChainNodeEntity)
            .set({ order: () => 'order - 1' })
            .where('chainId = :chainId AND order > :nodeOrder', { chainId, nodeOrder })
            .execute();
    }
    async getNodesByChain(chainId) {
        return await this.nodeRepository.find({
            where: { chainId },
            relations: ['agent'],
            order: { order: 'ASC' },
        });
    }
};
exports.ChainNodesService = ChainNodesService;
exports.ChainNodesService = ChainNodesService = ChainNodesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chain_node_entity_1.ChainNodeEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        chains_service_1.ChainsService])
], ChainNodesService);
