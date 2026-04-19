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
var ToolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tool_entity_1 = require("../../../infrastructure/database/entities/tool.entity");
let ToolsService = ToolsService_1 = class ToolsService {
    constructor(toolRepository) {
        this.toolRepository = toolRepository;
        this.logger = new common_1.Logger(ToolsService_1.name);
    }
    async create(createToolDto) {
        this.logger.log(`Creating tool: ${createToolDto.name}`);
        const tool = this.toolRepository.create({
            ...createToolDto,
            isActive: true,
        });
        return await this.toolRepository.save(tool);
    }
    async findAll(skip = 0, limit = 10) {
        const [tools, total] = await this.toolRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { tools, total };
    }
    async findOne(id) {
        const tool = await this.toolRepository.findOne({ where: { id } });
        if (!tool) {
            throw new common_1.NotFoundException(`Tool with ID ${id} not found`);
        }
        return tool;
    }
    async update(id, updateToolDto) {
        this.logger.log(`Updating tool: ${id}`);
        const tool = await this.findOne(id);
        Object.assign(tool, updateToolDto);
        return await this.toolRepository.save(tool);
    }
    async remove(id) {
        this.logger.log(`Deleting tool: ${id}`);
        const result = await this.toolRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Tool with ID ${id} not found`);
        }
        return { success: true };
    }
    async getActiveTools() {
        return await this.toolRepository.find({ where: { isActive: true } });
    }
};
exports.ToolsService = ToolsService;
exports.ToolsService = ToolsService = ToolsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tool_entity_1.ToolEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ToolsService);
