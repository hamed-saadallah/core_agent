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
exports.AgentRunsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const agent_runs_service_1 = require("../services/agent-runs.service");
const agent_run_dto_1 = require("../dtos/agent-run.dto");
const create_chat_request_dto_1 = require("../dtos/create-chat-request.dto");
const all_exceptions_filter_1 = require("../../../common/filters/all-exceptions.filter");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let AgentRunsController = class AgentRunsController {
    constructor(agentRunsService) {
        this.agentRunsService = agentRunsService;
    }
    async create(createAgentRunDto, user) {
        return await this.agentRunsService.create(createAgentRunDto, user.id);
    }
    async findAll(agentId, status, skip, limit, user) {
        return await this.agentRunsService.findAll({
            agentId,
            status,
            skip: skip || 0,
            limit: limit || 10,
            userId: user?.id,
        });
    }
    async findOne(id, user) {
        return await this.agentRunsService.findOne(id, user?.id);
    }
    async getRunsByAgent(agentId, skip, limit, user) {
        return await this.agentRunsService.getRunsByAgent(agentId, skip || 0, limit || 10, user?.id);
    }
    async chat(createChatRequestDto, user) {
        return await this.agentRunsService.executeChatMessage(createChatRequestDto.agentId, user.id, createChatRequestDto.message, createChatRequestDto.conversationHistory);
    }
};
exports.AgentRunsController = AgentRunsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new agent run' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agent run created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_run_dto_1.CreateAgentRunDto, Object]),
    __metadata("design:returntype", Promise)
], AgentRunsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agent runs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agent runs' }),
    __param(0, (0, common_1.Query)('agentId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AgentRunsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent run by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent run details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentRunsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent runs by agent ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agent runs' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AgentRunsController.prototype, "getRunsByAgent", null);
__decorate([
    (0, common_1.Post)('chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Chat with an agent interactively' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat response with updated conversation history' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_request_dto_1.CreateChatRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AgentRunsController.prototype, "chat", null);
exports.AgentRunsController = AgentRunsController = __decorate([
    (0, swagger_1.ApiTags)('agent-runs'),
    (0, common_1.Controller)('agent-runs'),
    (0, common_1.UseFilters)(all_exceptions_filter_1.AllExceptionsFilter),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [agent_runs_service_1.AgentRunsService])
], AgentRunsController);
