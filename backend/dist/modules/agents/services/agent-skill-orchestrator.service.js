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
var AgentSkillOrchestratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSkillOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../../../infrastructure/database/entities/agent.entity");
const model_entity_1 = require("../../../infrastructure/database/entities/model.entity");
const skill_executor_service_1 = require("../../skills/services/skill-executor.service");
const skill_runs_service_1 = require("../../skills/services/skill-runs.service");
const llm_service_1 = require("../../../infrastructure/llm/llm.service");
const models_service_1 = require("../../models/models.service");
let AgentSkillOrchestratorService = AgentSkillOrchestratorService_1 = class AgentSkillOrchestratorService {
    constructor(agentRepository, modelRepository, skillExecutorService, skillRunsService, llmService, modelsService) {
        this.agentRepository = agentRepository;
        this.modelRepository = modelRepository;
        this.skillExecutorService = skillExecutorService;
        this.skillRunsService = skillRunsService;
        this.llmService = llmService;
        this.modelsService = modelsService;
        this.logger = new common_1.Logger(AgentSkillOrchestratorService_1.name);
    }
    /**
     * Execute agent with context enrichment from skills
     * Approach #3: Pre-fetch skill data and inject into prompt
     */
    async executeAgentWithContextEnrichment(agentId, userMessage, userId) {
        this.logger.log(`Executing agent ${agentId} with context enrichment`);
        // 1. Load agent with its assigned skills
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
            relations: ['skills', 'model'],
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent ${agentId} not found`);
        }
        if (!agent.model) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a model assigned`);
        }
        if (!agent.promptTemplate) {
            throw new common_1.BadRequestException(`Agent ${agentId} does not have a prompt template`);
        }
        // 2. Determine which skills to invoke based on user input
        const skillsToExecute = this.selectRelevantSkills(agent.skills || [], userMessage);
        this.logger.log(`Selected ${skillsToExecute.length} skills for execution`);
        // 3. Execute all relevant skills and collect context
        const skillContexts = [];
        for (const skill of skillsToExecute) {
            try {
                const context = await this.executeSkillAndCaptureContext(skill, userMessage, userId);
                skillContexts.push(context);
            }
            catch (error) {
                // Capture error but don't fail entire execution
                skillContexts.push({
                    skillName: skill.name,
                    output: {},
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
        // 4. Build enriched prompt with skill context
        const enrichedPrompt = this.buildEnrichedPrompt(agent.promptTemplate, skillContexts, userMessage);
        this.logger.debug(`Enriched prompt: ${enrichedPrompt}`);
        // 5. Call LLM with enriched context
        const decryptedApiKey = this.modelsService.decryptApiKey(agent.model);
        try {
            const llmResponse = await this.llmService.execute({
                prompt: enrichedPrompt,
                temperature: agent.temperature || 0.7,
                model: agent.model.name,
                apiKey: decryptedApiKey,
                maxTokens: 2000,
                timeout: 30000,
            });
            return {
                response: llmResponse.output,
                skillsUsed: skillContexts.map((ctx) => ctx.skillName),
                skillDetails: skillContexts,
            };
        }
        catch (error) {
            this.logger.error(`LLM execution failed: ${error}`);
            throw new common_1.BadRequestException(`Agent execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Determine which skills are relevant based on user input
     * Uses keyword matching from skill names and descriptions
     */
    selectRelevantSkills(skills, userMessage) {
        if (!skills || skills.length === 0) {
            return [];
        }
        const messageLower = userMessage.toLowerCase();
        return skills.filter((skill) => {
            const skillNameLower = skill.name.toLowerCase();
            const skillDescLower = skill.description?.toLowerCase() || '';
            // Extract keywords from skill name
            const keywords = this.extractSkillKeywords(skillNameLower);
            // Check if any keyword appears in message
            const keywordMatch = keywords.some((keyword) => messageLower.includes(keyword));
            // Also check full skill name
            const nameMatch = messageLower.includes(skillNameLower);
            // Check description keywords
            const descMatch = skillDescLower.length > 0 &&
                skillDescLower.split(/\s+/).some((word) => messageLower.includes(word) && word.length > 3);
            return keywordMatch || nameMatch || descMatch;
        });
    }
    /**
     * Extract keywords from skill name for matching
     * Example: "GetCustomerProfile" -> ["customer", "profile"]
     */
    extractSkillKeywords(skillName) {
        // Split camelCase and lowercase
        const words = skillName
            .replace(/([A-Z])/g, ' $1')
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 0 && w.length > 2); // Filter out very short words
        return words;
    }
    /**
     * Execute a single skill and capture its output as context
     */
    async executeSkillAndCaptureContext(skill, userMessage, userId) {
        this.logger.log(`Executing skill: ${skill.name}`);
        // Create a skill run record
        const skillRun = await this.skillRunsService.create(skill.id, userId, {
            userQuery: userMessage,
            contextEnrichment: true,
        });
        try {
            // Extract input parameters from user message or use defaults
            const skillInput = this.extractSkillInputFromMessage(skill, userMessage);
            // Execute the skill
            const result = await this.skillExecutorService.executeSkill(skill, skillInput, skillRun);
            return {
                skillName: skill.name,
                output: result,
            };
        }
        catch (error) {
            this.logger.error(`Skill ${skill.name} execution failed: ${error}`);
            return {
                skillName: skill.name,
                output: {},
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    /**
     * Extract input parameters from user message for skill execution
     * Examples:
     * - "Show me customer John Doe" -> { "customerName": "John Doe" }
     * - "What flights does customer 123 have?" -> { "customerId": "123" }
     */
    extractSkillInputFromMessage(skill, userMessage) {
        const input = {};
        // For API call skills, extract parameters based on schema
        if (skill.type === 'api_call' && skill.inputSchema) {
            const requiredParams = Object.keys(skill.inputSchema.properties || {});
            requiredParams.forEach((param) => {
                // Try to extract parameter value from message using pattern matching
                const regex = new RegExp(`${param}[:\\s]+([\\w@.\\-]+)`, 'i');
                const match = userMessage.match(regex);
                if (match) {
                    input[param] = match[1];
                }
            });
            // If no parameters found, try common patterns
            if (Object.keys(input).length === 0) {
                // Extract email pattern
                const emailMatch = userMessage.match(/[\w\.-]+@[\w\.-]+\.\w+/);
                if (emailMatch && requiredParams.includes('email')) {
                    input['email'] = emailMatch[0];
                }
                // Extract name pattern
                const nameMatch = userMessage.match(/(?:customer|user|name)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
                if (nameMatch && requiredParams.includes('customerName')) {
                    input['customerName'] = nameMatch[1];
                }
                // Extract ID pattern
                const idMatch = userMessage.match(/(?:id|customer)\s+([A-Z0-9]+)/i);
                if (idMatch && requiredParams.includes('customerId')) {
                    input['customerId'] = idMatch[1];
                }
            }
        }
        // Fallback: pass the entire message as query
        if (Object.keys(input).length === 0) {
            input['query'] = userMessage;
        }
        return input;
    }
    /**
     * Build the enriched prompt with skill context
     * Inject skill results into the agent's prompt template
     */
    buildEnrichedPrompt(basePrompt, skillContexts, userMessage) {
        // Build context section from skill results
        const contextSection = this.buildContextSection(skillContexts);
        // Combine base prompt + context + user message
        return `${basePrompt}

${contextSection}

User Query: ${userMessage}

Please provide a helpful response based on the information above.`;
    }
    /**
     * Format skill results as readable context
     */
    buildContextSection(skillContexts) {
        if (skillContexts.length === 0) {
            return '';
        }
        let contextText = '## Available Information:\n\n';
        skillContexts.forEach((context) => {
            contextText += `### ${context.skillName}:\n`;
            if (context.error) {
                contextText += `⚠️ Error: ${context.error}\n`;
            }
            else if (Object.keys(context.output).length === 0) {
                contextText += 'No data returned\n';
            }
            else {
                // Format output as readable JSON
                contextText += '```json\n';
                contextText += JSON.stringify(context.output, null, 2);
                contextText += '\n```\n';
            }
            contextText += '\n';
        });
        return contextText;
    }
};
exports.AgentSkillOrchestratorService = AgentSkillOrchestratorService;
exports.AgentSkillOrchestratorService = AgentSkillOrchestratorService = AgentSkillOrchestratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.AgentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.ModelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        skill_executor_service_1.SkillExecutorService,
        skill_runs_service_1.SkillRunsService,
        llm_service_1.LLMService,
        models_service_1.ModelsService])
], AgentSkillOrchestratorService);
