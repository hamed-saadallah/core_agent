import { AgentsService } from '../services/agents.service';
import { AgentSkillOrchestratorService } from '../services/agent-skill-orchestrator.service';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentWithParametersDto } from '../dtos/agent.dto';
import { ExecuteWithContextDto, ExecuteWithContextResponseDto } from '../dtos/agent-execution.dto';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
export declare class AgentsController {
    private readonly agentsService;
    private readonly agentSkillOrchestratorService;
    constructor(agentsService: AgentsService, agentSkillOrchestratorService: AgentSkillOrchestratorService);
    create(createAgentDto: CreateAgentDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/agent.entity").AgentEntity>;
    findAll(user: UserEntity, skip?: number, limit?: number): Promise<{
        agents: import("../../../infrastructure/database/entities/agent.entity").AgentEntity[];
        total: number;
    }>;
    findOne(id: string, user: UserEntity): Promise<import("../../../infrastructure/database/entities/agent.entity").AgentEntity>;
    update(id: string, updateAgentDto: UpdateAgentDto, user: UserEntity): Promise<import("../../../infrastructure/database/entities/agent.entity").AgentEntity>;
    remove(id: string, user: UserEntity): Promise<{
        success: boolean;
    }>;
    execute(id: string, executeDto: ExecuteAgentWithParametersDto, user: UserEntity): Promise<{
        success: boolean;
        output: any;
        executionTime: number;
        runId: string;
    }>;
    executeWithContextEnrichment(id: string, executeWithContextDto: ExecuteWithContextDto, user: UserEntity): Promise<ExecuteWithContextResponseDto>;
}
