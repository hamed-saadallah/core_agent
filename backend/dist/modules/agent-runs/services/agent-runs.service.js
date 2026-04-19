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
var AgentRunsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRunsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_run_entity_1 = require("../../../infrastructure/database/entities/agent-run.entity");
const llm_service_1 = require("../../../infrastructure/llm/llm.service");
const models_service_1 = require("../../models/models.service");
const model_entity_1 = require("../../../infrastructure/database/entities/model.entity");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
let AgentRunsService = AgentRunsService_1 = class AgentRunsService {
    constructor(runRepository, modelRepository, agentRepository, llmService, modelsService) {
        this.runRepository = runRepository;
        this.modelRepository = modelRepository;
        this.agentRepository = agentRepository;
        this.llmService = llmService;
        this.modelsService = modelsService;
        this.logger = new common_1.Logger(AgentRunsService_1.name);
    }
    async create(createAgentRunDto, userId) {
        this.logger.log(`Creating agent run for agent: ${createAgentRunDto.agentId}`);
        const run = this.runRepository.create({
            ...createAgentRunDto,
            userId,
            status: 'pending',
        });
        return await this.runRepository.save(run);
    }
    async findAll(query) {
        const qb = this.runRepository.createQueryBuilder('run');
        if (query.userId) {
            qb.where('run.userId = :userId', { userId: query.userId });
        }
        if (query.agentId) {
            qb.andWhere('run.agentId = :agentId', { agentId: query.agentId });
        }
        if (query.status) {
            qb.andWhere('run.status = :status', { status: query.status });
        }
        const skip = query.skip || 0;
        const limit = query.limit || 10;
        const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();
        return { runs, total };
    }
    async findOne(id, userId) {
        const run = await this.runRepository.findOne({ where: { id } });
        if (!run) {
            throw new common_1.NotFoundException(`Agent run with ID ${id} not found`);
        }
        if (userId && run.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this agent run');
        }
        return run;
    }
    async updateStatus(id, status, output, error) {
        const run = await this.findOne(id);
        run.status = status;
        if (output) {
            run.output = output;
        }
        if (error) {
            run.error = error;
        }
        run.executionTime = run.executionTime || new Date().getTime() - new Date(run.createdAt).getTime();
        return await this.runRepository.save(run);
    }
    async getRunsByAgent(agentId, skip = 0, limit = 10, userId) {
        const where = { agentId };
        if (userId) {
            where.userId = userId;
        }
        const [runs, total] = await this.runRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { runs, total };
    }
    async getRunsByUser(userId, skip = 0, limit = 10) {
        const [runs, total] = await this.runRepository.findAndCount({
            where: { userId },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { runs, total };
    }
    async executeAgentRun(agentId, userId, parameters, promptTemplate, modelId, temperature, metadata) {
        this.logger.log(`Executing agent run for agent: ${agentId}`);
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
            relations: ['model'],
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        if (!promptTemplate) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a prompt template`);
        }
        if (!modelId) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a model assigned`);
        }
        const model = await this.modelRepository.findOne({
            where: { id: modelId },
        });
        if (!model) {
            throw new common_1.BadRequestException(`Model ${modelId} not found`);
        }
        const decryptedApiKey = this.modelsService.decryptApiKey(model);
        const finalTemperature = temperature || model.temperature;
        const startTime = Date.now();
        let filledPrompt = promptTemplate;
        const parameterRegex = /{(\w+)}/g;
        const matches = filledPrompt.match(parameterRegex);
        if (matches) {
            matches.forEach((match) => {
                const paramName = match.slice(1, -1);
                const paramValue = parameters[paramName];
                if (paramValue !== undefined) {
                    filledPrompt = filledPrompt.replace(new RegExp(match, 'g'), paramValue);
                }
            });
        }
        const run = this.runRepository.create({
            agentId,
            userId,
            input: { template: promptTemplate, parameters },
            status: 'pending',
            metadata,
        });
        const savedRun = await this.runRepository.save(run);
        try {
            let executionResult;
            const mockExecutionEnabled = process.env.MOCK_EXECUTION === 'true';
            if (mockExecutionEnabled) {
                this.logger.log('Using mock execution');
                executionResult = {
                    output: `Executed prompt with model ${model.name} (v${model.version}) at temperature ${finalTemperature}:\n\n${filledPrompt}\n\nThis is a simulated execution result.`,
                    model: model.name,
                    version: model.version,
                    temperature: finalTemperature,
                    status: 'completed',
                };
            }
            else {
                this.logger.log('Using real LLM execution');
                try {
                    const llmResponse = await this.llmService.execute({
                        prompt: filledPrompt,
                        temperature: parseFloat(String(finalTemperature)),
                        model: model.name,
                        apiKey: decryptedApiKey,
                        maxTokens: 2000,
                        timeout: 30000,
                    });
                    executionResult = {
                        output: llmResponse.output,
                        model: llmResponse.model,
                        version: model.version,
                        temperature: llmResponse.temperature,
                        inputTokens: llmResponse.inputTokens,
                        outputTokens: llmResponse.outputTokens,
                        totalTokens: llmResponse.totalTokens,
                        finishReason: llmResponse.finishReason,
                        status: 'completed',
                    };
                }
                catch (llmError) {
                    this.logger.error(`LLM execution error: ${llmError}`);
                    throw new common_1.BadRequestException(`LLM execution failed: ${llmError instanceof Error ? llmError.message : String(llmError)}`);
                }
            }
            const executionTime = Date.now() - startTime;
            savedRun.output = executionResult;
            savedRun.status = 'completed';
            savedRun.executionTime = executionTime;
            await this.runRepository.save(savedRun);
            return {
                success: true,
                output: executionResult,
                executionTime,
                runId: savedRun.id,
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            savedRun.status = 'failed';
            savedRun.error = error instanceof Error ? error.message : String(error);
            savedRun.executionTime = executionTime;
            await this.runRepository.save(savedRun);
            this.logger.error(`Agent execution failed: ${error}`);
            throw new common_1.BadRequestException(`Agent execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    formatConversationHistory(conversationHistory) {
        if (!conversationHistory || conversationHistory.length === 0) {
            return '';
        }
        const formatted = conversationHistory
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n\n');
        return `Previous conversation:\n${formatted}\n\n`;
    }
    async executeChatMessage(agentId, userId, message, conversationHistory) {
        this.logger.log(`Executing chat message for agent: ${agentId}`);
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
            relations: ['model'],
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        if (!agent.promptTemplate) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a prompt template`);
        }
        if (!agent.modelId) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a model assigned`);
        }
        const model = await this.modelRepository.findOne({
            where: { id: agent.modelId },
        });
        if (!model) {
            throw new common_1.BadRequestException(`Model ${agent.modelId} not found`);
        }
        const decryptedApiKey = this.modelsService.decryptApiKey(model);
        const finalTemperature = agent.temperature || model.temperature;
        const conversationContext = this.formatConversationHistory(conversationHistory || []);
        const enhancedPrompt = `${agent.promptTemplate}\n\n${conversationContext}User: ${message}`;
        try {
            const mockExecutionEnabled = process.env.MOCK_EXECUTION === 'true';
            let response;
            if (mockExecutionEnabled) {
                this.logger.log('Using mock execution for chat');
                response = `Mock response to: "${message}"`;
            }
            else {
                this.logger.log('Using real LLM execution for chat');
                const llmResponse = await this.llmService.execute({
                    prompt: enhancedPrompt,
                    temperature: parseFloat(String(finalTemperature)),
                    model: model.name,
                    apiKey: decryptedApiKey,
                    maxTokens: 2000,
                    timeout: 30000,
                });
                response = llmResponse.output;
            }
            const updatedHistory = [
                ...(conversationHistory || []),
                { role: 'user', content: message },
                { role: 'assistant', content: response },
            ];
            return {
                response,
                conversationHistory: updatedHistory,
            };
        }
        catch (error) {
            this.logger.error(`Chat execution failed: ${error}`);
            throw new common_1.BadRequestException(`Chat execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.AgentRunsService = AgentRunsService;
exports.AgentRunsService = AgentRunsService = AgentRunsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_run_entity_1.AgentRunEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.ModelEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        llm_service_1.LLMService,
        models_service_1.ModelsService])
], AgentRunsService);
