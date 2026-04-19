import { Repository } from 'typeorm';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { PromptEntity } from '@/infrastructure/database/entities/prompt.entity';
import { AgentRunEntity } from '@/infrastructure/database/entities/agent-run.entity';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentWithParametersDto } from '../dtos/agent.dto';
import { ModelsService } from '@/modules/models/models.service';
import { LLMService } from '@/infrastructure/llm/llm.service';
import { AgentRunsService } from '@/modules/agent-runs/services/agent-runs.service';
export declare class AgentsService {
    private agentRepository;
    private toolRepository;
    private promptRepository;
    private agentRunRepository;
    private modelRepository;
    private modelsService;
    private llmService;
    private agentRunsService;
    private readonly logger;
    constructor(agentRepository: Repository<AgentEntity>, toolRepository: Repository<ToolEntity>, promptRepository: Repository<PromptEntity>, agentRunRepository: Repository<AgentRunEntity>, modelRepository: Repository<ModelEntity>, modelsService: ModelsService, llmService: LLMService, agentRunsService: AgentRunsService);
    create(createAgentDto: CreateAgentDto, userId: string): Promise<AgentEntity>;
    findAll(userId?: string, skip?: number, limit?: number): Promise<{
        agents: AgentEntity[];
        total: number;
    }>;
    findOne(id: string, userId?: string): Promise<AgentEntity>;
    update(id: string, updateAgentDto: UpdateAgentDto, userId?: string): Promise<AgentEntity>;
    remove(id: string, userId?: string): Promise<{
        success: boolean;
    }>;
    getAgentsByUser(userId: string): Promise<AgentEntity[]>;
    execute(agentId: string, executeDto: ExecuteAgentWithParametersDto, userId: string): Promise<{
        success: boolean;
        output: any;
        executionTime: number;
        runId: string;
    }>;
    private isDuplicateKeyError;
}
