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
var AgentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
const tool_entity_1 = require("../../../infrastructure/database/entities/tool.entity");
const prompt_entity_1 = require("../../../infrastructure/database/entities/prompt.entity");
const agent_run_entity_1 = require("../../../infrastructure/database/entities/agent-run.entity");
const model_entity_1 = require("../../../infrastructure/database/entities/model.entity");
const models_service_1 = require("../../models/models.service");
const llm_service_1 = require("../../../infrastructure/llm/llm.service");
const agent_runs_service_1 = require("../../agent-runs/services/agent-runs.service");
let AgentsService = AgentsService_1 = class AgentsService {
    constructor(agentRepository, toolRepository, promptRepository, agentRunRepository, modelRepository, modelsService, llmService, agentRunsService) {
        this.agentRepository = agentRepository;
        this.toolRepository = toolRepository;
        this.promptRepository = promptRepository;
        this.agentRunRepository = agentRunRepository;
        this.modelRepository = modelRepository;
        this.modelsService = modelsService;
        this.llmService = llmService;
        this.agentRunsService = agentRunsService;
        this.logger = new common_1.Logger(AgentsService_1.name);
    }
    async create(createAgentDto, userId) {
        this.logger.log(`Creating agent: ${createAgentDto.name}`);
        // Validate that the model exists
        const model = await this.modelRepository.findOne({
            where: { id: createAgentDto.modelId },
        });
        if (!model) {
            throw new common_1.BadRequestException(`Model with ID ${createAgentDto.modelId} not found`);
        }
        const agent = this.agentRepository.create({
            ...createAgentDto,
            ownerId: userId,
            status: 'active',
            modelId: createAgentDto.modelId,
        });
        if (createAgentDto.toolIds && createAgentDto.toolIds.length > 0) {
            agent.tools = await this.toolRepository.find({
                where: { id: (0, typeorm_2.In)(createAgentDto.toolIds) }
            });
        }
        if (createAgentDto.promptId) {
            const prompt = await this.promptRepository.findOne({ where: { id: createAgentDto.promptId } });
            if (prompt) {
                agent.prompt = prompt;
                agent.promptId = prompt.id;
            }
        }
        try {
            return await this.agentRepository.save(agent);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('An agent with this name already exists for your account');
            }
            throw error;
        }
    }
    async findAll(userId, skip = 0, limit = 10) {
        const query = this.agentRepository.createQueryBuilder('agent').leftJoinAndSelect('agent.model', 'model');
        if (userId) {
            query.where('agent.ownerId = :userId', { userId });
        }
        const [agents, total] = await query.skip(skip).take(limit).getManyAndCount();
        return { agents, total };
    }
    async findOne(id, userId) {
        const agent = await this.agentRepository.findOne({
            where: { id },
            relations: ['model'],
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        // Check ownership if userId is provided
        if (userId && agent.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this agent');
        }
        return agent;
    }
    async update(id, updateAgentDto, userId) {
        this.logger.log(`Updating agent: ${id}`);
        const agent = await this.findOne(id, userId);
        // If modelId is being updated, validate it exists
        if (updateAgentDto.modelId) {
            const model = await this.modelRepository.findOne({
                where: { id: updateAgentDto.modelId },
            });
            if (!model) {
                throw new common_1.BadRequestException(`Model with ID ${updateAgentDto.modelId} not found`);
            }
        }
        Object.assign(agent, updateAgentDto);
        if (updateAgentDto.toolIds) {
            agent.tools = await this.toolRepository.find({
                where: { id: (0, typeorm_2.In)(updateAgentDto.toolIds) }
            });
        }
        if (updateAgentDto.promptId) {
            const prompt = await this.promptRepository.findOne({ where: { id: updateAgentDto.promptId } });
            if (prompt) {
                agent.prompt = prompt;
                agent.promptId = prompt.id;
            }
        }
        try {
            return await this.agentRepository.save(agent);
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('An agent with this name already exists for your account');
            }
            throw error;
        }
    }
    async remove(id, userId) {
        this.logger.log(`Deleting agent: ${id}`);
        // Check ownership first
        const agent = await this.findOne(id, userId);
        const result = await this.agentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return { success: true };
    }
    async getAgentsByUser(userId) {
        return await this.agentRepository.find({ where: { ownerId: userId } });
    }
    async execute(agentId, executeDto, userId) {
        this.logger.log(`Executing agent: ${agentId}`);
        const agent = await this.findOne(agentId, userId);
        if (!agent.promptTemplate) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a prompt template`);
        }
        if (!agent.modelId) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a model assigned`);
        }
        return await this.agentRunsService.executeAgentRun(agentId, userId, executeDto.parameters || {}, agent.promptTemplate, agent.modelId, agent.temperature, executeDto.metadata);
    }
    isDuplicateKeyError(error) {
        if (!(error instanceof typeorm_2.QueryFailedError)) {
            return false;
        }
        const pgError = error;
        return pgError.code === '23505';
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = AgentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(tool_entity_1.ToolEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(prompt_entity_1.PromptEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(agent_run_entity_1.AgentRunEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(model_entity_1.ModelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        models_service_1.ModelsService,
        llm_service_1.LLMService,
        agent_runs_service_1.AgentRunsService])
], AgentsService);
