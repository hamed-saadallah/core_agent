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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const agents_service_1 = require("../services/agents.service");
const agent_skill_orchestrator_service_1 = require("../services/agent-skill-orchestrator.service");
const agent_dto_1 = require("../dtos/agent.dto");
const agent_execution_dto_1 = require("../dtos/agent-execution.dto");
const all_exceptions_filter_1 = require("../../../common/filters/all-exceptions.filter");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../../infrastructure/database/entities/user.entity");
let AgentsController = class AgentsController {
    constructor(agentsService, agentSkillOrchestratorService) {
        this.agentsService = agentsService;
        this.agentSkillOrchestratorService = agentSkillOrchestratorService;
    }
    async create(createAgentDto, user) {
        return await this.agentsService.create(createAgentDto, user.id);
    }
    async findAll(user, skip, limit) {
        return await this.agentsService.findAll(user.id, skip || 0, limit || 10);
    }
    async findOne(id, user) {
        return await this.agentsService.findOne(id, user.id);
    }
    async update(id, updateAgentDto, user) {
        return await this.agentsService.update(id, updateAgentDto, user.id);
    }
    async remove(id, user) {
        return await this.agentsService.remove(id, user.id);
    }
    async execute(id, executeDto, user) {
        return await this.agentsService.execute(id, executeDto, user.id);
    }
    async executeWithContextEnrichment(id, executeWithContextDto, user) {
        return await this.agentSkillOrchestratorService.executeAgentWithContextEnrichment(id, executeWithContextDto.userMessage, user.id);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new agent' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agent created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_dto_1.CreateAgentDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update agent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_dto_1.UpdateAgentDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete agent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute an agent with prompt template parameters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent executed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_dto_1.ExecuteAgentWithParametersDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "execute", null);
__decorate([
    (0, common_1.Post)(':id/execute-with-context'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute agent with automatic context enrichment from assigned skills' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent executed with context enrichment', type: agent_execution_dto_1.ExecuteWithContextResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agent_execution_dto_1.ExecuteWithContextDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "executeWithContextEnrichment", null);
exports.AgentsController = AgentsController = __decorate([
    (0, swagger_1.ApiTags)('agents'),
    (0, common_1.Controller)('agents'),
    (0, common_1.UseFilters)(all_exceptions_filter_1.AllExceptionsFilter),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        agent_skill_orchestrator_service_1.AgentSkillOrchestratorService])
], AgentsController);
