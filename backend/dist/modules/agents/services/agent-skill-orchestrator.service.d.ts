import { Repository } from 'typeorm';
import { AgentEntity } from '../../../infrastructure/database/entities/agent.entity';
import { ModelEntity } from '../../../infrastructure/database/entities/model.entity';
import { SkillExecutorService } from '../../../modules/skills/services/skill-executor.service';
import { SkillRunsService } from '../../../modules/skills/services/skill-runs.service';
import { LLMService } from '../../../infrastructure/llm/llm.service';
import { ModelsService } from '../../../modules/models/models.service';
export interface SkillContext {
    skillName: string;
    output: Record<string, any>;
    error?: string;
}
export interface ExecuteWithContextResponse {
    response: string;
    skillsUsed: string[];
    skillDetails: SkillContext[];
}
export declare class AgentSkillOrchestratorService {
    private agentRepository;
    private modelRepository;
    private skillExecutorService;
    private skillRunsService;
    private llmService;
    private modelsService;
    private readonly logger;
    constructor(agentRepository: Repository<AgentEntity>, modelRepository: Repository<ModelEntity>, skillExecutorService: SkillExecutorService, skillRunsService: SkillRunsService, llmService: LLMService, modelsService: ModelsService);
    /**
     * Execute agent with context enrichment from skills
     * Approach #3: Pre-fetch skill data and inject into prompt
     */
    executeAgentWithContextEnrichment(agentId: string, userMessage: string, userId: string): Promise<ExecuteWithContextResponse>;
    /**
     * Determine which skills are relevant based on user input
     * Uses keyword matching from skill names and descriptions
     */
    private selectRelevantSkills;
    /**
     * Extract keywords from skill name for matching
     * Example: "GetCustomerProfile" -> ["customer", "profile"]
     */
    private extractSkillKeywords;
    /**
     * Execute a single skill and capture its output as context
     */
    private executeSkillAndCaptureContext;
    /**
     * Extract input parameters from user message for skill execution
     * Examples:
     * - "Show me customer John Doe" -> { "customerName": "John Doe" }
     * - "What flights does customer 123 have?" -> { "customerId": "123" }
     */
    private extractSkillInputFromMessage;
    /**
     * Build the enriched prompt with skill context
     * Inject skill results into the agent's prompt template
     */
    private buildEnrichedPrompt;
    /**
     * Format skill results as readable context
     */
    private buildContextSection;
}
