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
var ChainsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chain_entity_1 = require("../../../infrastructure/database/entities/chain.entity");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
let ChainsService = ChainsService_1 = class ChainsService {
    constructor(chainRepository, agentRepository) {
        this.chainRepository = chainRepository;
        this.agentRepository = agentRepository;
        this.logger = new common_1.Logger(ChainsService_1.name);
    }
    async create(createChainDto, userId) {
        this.logger.log(`Creating chain: ${createChainDto.name}`);
        const chain = this.chainRepository.create({
            ...createChainDto,
            ownerId: userId,
            status: 'active',
            nodes: [],
        });
        try {
            return await this.chainRepository.save(chain);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('A chain with this name already exists for your account');
            }
            throw error;
        }
    }
    async findAll(userId, query) {
        const qb = this.chainRepository.createQueryBuilder('chain').leftJoinAndSelect('chain.nodes', 'nodes').leftJoinAndSelect('nodes.agent', 'agent');
        if (userId) {
            qb.where('chain.ownerId = :userId', { userId });
        }
        if (query?.status) {
            qb.andWhere('chain.status = :status', { status: query.status });
        }
        const skip = query?.skip || 0;
        const limit = query?.limit || 10;
        const [chains, total] = await qb.skip(skip).take(limit).orderBy('chain.createdAt', 'DESC').getManyAndCount();
        return { chains, total };
    }
    async findOne(id, userId) {
        const chain = await this.chainRepository.findOne({
            where: { id },
            relations: ['nodes', 'nodes.agent'],
        });
        if (!chain) {
            throw new common_1.NotFoundException(`Chain with ID ${id} not found`);
        }
        if (userId && chain.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this chain');
        }
        return chain;
    }
    async update(id, updateChainDto, userId) {
        const chain = await this.findOne(id, userId);
        if (updateChainDto.name) {
            chain.name = updateChainDto.name;
        }
        if (updateChainDto.description) {
            chain.description = updateChainDto.description;
        }
        if (updateChainDto.startingPrompt) {
            chain.startingPrompt = updateChainDto.startingPrompt;
        }
        if (updateChainDto.config) {
            chain.config = updateChainDto.config;
        }
        try {
            return await this.chainRepository.save(chain);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('A chain with this name already exists for your account');
            }
            throw error;
        }
    }
    async delete(id, userId) {
        const chain = await this.findOne(id, userId);
        await this.chainRepository.remove(chain);
    }
    isDuplicateKeyError(error) {
        return error instanceof typeorm_2.QueryFailedError && error.driverError?.code === '23505';
    }
};
exports.ChainsService = ChainsService;
exports.ChainsService = ChainsService = ChainsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chain_entity_1.ChainEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChainsService);
