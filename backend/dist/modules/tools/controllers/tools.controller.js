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
exports.ToolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tools_service_1 = require("../services/tools.service");
const tool_dto_1 = require("../dtos/tool.dto");
const all_exceptions_filter_1 = require("../../../common/filters/all-exceptions.filter");
let ToolsController = class ToolsController {
    constructor(toolsService) {
        this.toolsService = toolsService;
    }
    async create(createToolDto) {
        return await this.toolsService.create(createToolDto);
    }
    async findAll(skip, limit) {
        return await this.toolsService.findAll(skip || 0, limit || 10);
    }
    async findOne(id) {
        return await this.toolsService.findOne(id);
    }
    async update(id, updateToolDto) {
        return await this.toolsService.update(id, updateToolDto);
    }
    async remove(id) {
        return await this.toolsService.remove(id);
    }
    async getActiveTools() {
        return await this.toolsService.getActiveTools();
    }
};
exports.ToolsController = ToolsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tool' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tool created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tool_dto_1.CreateToolDto]),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tools' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tools' }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tool by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tool details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tool' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tool updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tool_dto_1.UpdateToolDto]),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tool' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tool deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('active/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active tools' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active tools' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ToolsController.prototype, "getActiveTools", null);
exports.ToolsController = ToolsController = __decorate([
    (0, swagger_1.ApiTags)('tools'),
    (0, common_1.Controller)('tools'),
    (0, common_1.UseFilters)(all_exceptions_filter_1.AllExceptionsFilter),
    __metadata("design:paramtypes", [tools_service_1.ToolsService])
], ToolsController);
