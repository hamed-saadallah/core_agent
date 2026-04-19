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
exports.ModelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("../../infrastructure/database/entities/model.entity");
const encryption_util_1 = require("../../common/utils/encryption.util");
const environment_1 = require("../../config/environment");
let ModelsService = class ModelsService {
    constructor(modelsRepository) {
        this.modelsRepository = modelsRepository;
        this.encryptionSecret = (0, environment_1.getEnvironmentVariables)().JWT_SECRET || 'secret-key';
    }
    async create(createModelDto, ownerId) {
        const encryptedApiKey = encryption_util_1.EncryptionUtil.encrypt(createModelDto.apiKey, this.encryptionSecret);
        const model = this.modelsRepository.create({
            ...createModelDto,
            apiKey: encryptedApiKey,
            status: createModelDto.status || 'enabled',
            temperature: createModelDto.temperature || 0.7,
            ownerId,
        });
        return await this.modelsRepository.save(model);
    }
    async findAll(ownerId) {
        return await this.modelsRepository.find({
            where: { ownerId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, ownerId) {
        const model = await this.modelsRepository.findOne({
            where: { id, ownerId },
        });
        if (!model) {
            throw new common_1.NotFoundException(`Model with id ${id} not found`);
        }
        return model;
    }
    async findOneById(id, ownerId) {
        const model = await this.modelsRepository.findOne({
            where: { id },
        });
        if (!model) {
            throw new common_1.NotFoundException(`Model with id ${id} not found`);
        }
        // Check ownership if ownerId is provided
        if (ownerId && model.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to access this model');
        }
        return model;
    }
    async update(id, updateModelDto, ownerId) {
        const model = await this.findOneById(id, ownerId);
        if (updateModelDto.apiKey) {
            updateModelDto.apiKey = encryption_util_1.EncryptionUtil.encrypt(updateModelDto.apiKey, this.encryptionSecret);
        }
        Object.assign(model, updateModelDto);
        return await this.modelsRepository.save(model);
    }
    async remove(id, ownerId) {
        const model = await this.findOneById(id, ownerId);
        const agentCount = await this.modelsRepository.query('SELECT COUNT(*) FROM agents WHERE "modelId" = $1', [id]);
        if (agentCount[0]?.count > 0) {
            throw new common_1.BadRequestException('Cannot delete model that is in use by agents');
        }
        await this.modelsRepository.remove(model);
    }
    decryptApiKey(model) {
        return encryption_util_1.EncryptionUtil.decrypt(model.apiKey, this.encryptionSecret);
    }
};
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_entity_1.ModelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModelsService);
