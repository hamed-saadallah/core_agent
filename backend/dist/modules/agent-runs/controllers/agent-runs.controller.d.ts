import { AgentRunsService } from '../services/agent-runs.service';
import { CreateAgentRunDto } from '../dtos/agent-run.dto';
import { CreateChatRequestDto } from '../dtos/create-chat-request.dto';
export declare class AgentRunsController {
    private readonly agentRunsService;
    constructor(agentRunsService: AgentRunsService);
    create(createAgentRunDto: CreateAgentRunDto, user: any): Promise<import("../../../infrastructure/database/entities/agent-run.entity").AgentRunEntity>;
    findAll(agentId?: string, status?: string, skip?: number, limit?: number, user?: any): Promise<{
        runs: import("../../../infrastructure/database/entities/agent-run.entity").AgentRunEntity[];
        total: number;
    }>;
    findOne(id: string, user?: any): Promise<import("../../../infrastructure/database/entities/agent-run.entity").AgentRunEntity>;
    getRunsByAgent(agentId: string, skip?: number, limit?: number, user?: any): Promise<{
        runs: import("../../../infrastructure/database/entities/agent-run.entity").AgentRunEntity[];
        total: number;
    }>;
    chat(createChatRequestDto: CreateChatRequestDto, user: any): Promise<{
        response: string;
        conversationHistory: Array<{
            role: string;
            content: string;
        }>;
    }>;
}
