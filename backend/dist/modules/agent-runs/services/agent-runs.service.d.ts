import { Repository } from 'typeorm';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { CreateAgentRunDto, QueryAgentRunsDto } from '../dtos/agent-run.dto';
import { LLMService } from '@/infrastructure/llm/llm.service';
import { ModelsService } from '@/modules/models/models.service';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
export declare class AgentRunsService {
    private runRepository;
    private modelRepository;
    private agentRepository;
    private llmService;
    private modelsService;
    private readonly logger;
    constructor(runRepository: Repository<AgentRunEntity>, modelRepository: Repository<ModelEntity>, agentRepository: Repository<AgentEntity>, llmService: LLMService, modelsService: ModelsService);
    create(createAgentRunDto: CreateAgentRunDto, userId: string): Promise<AgentRunEntity>;
    findAll(query: QueryAgentRunsDto & {
        userId?: string;
    }): Promise<{
        runs: AgentRunEntity[];
        total: number;
    }>;
    findOne(id: string, userId?: string): Promise<AgentRunEntity>;
    updateStatus(id: string, status: string, output?: any, error?: string): Promise<AgentRunEntity>;
    getRunsByAgent(agentId: string, skip?: number, limit?: number, userId?: string): Promise<{
        runs: AgentRunEntity[];
        total: number;
    }>;
    getRunsByUser(userId: string, skip?: number, limit?: number): Promise<{
        runs: AgentRunEntity[];
        total: number;
    }>;
    executeAgentRun(agentId: string, userId: string, parameters: Record<string, any>, promptTemplate: string, modelId: string, temperature?: number, metadata?: Record<string, any>): Promise<{
        success: boolean;
        output: any;
        executionTime: number;
        runId: string;
    }>;
    private formatConversationHistory;
    executeChatMessage(agentId: string, userId: string, message: string, conversationHistory?: Array<{
        role: string;
        content: string;
    }>): Promise<{
        response: string;
        conversationHistory: Array<{
            role: string;
            content: string;
        }>;
    }>;
}
