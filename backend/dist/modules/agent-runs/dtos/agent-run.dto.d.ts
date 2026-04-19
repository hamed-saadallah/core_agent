export declare class CreateAgentRunDto {
    agentId: string;
    input: any;
    metadata?: Record<string, any>;
}
export declare class QueryAgentRunsDto {
    agentId?: string;
    status?: string;
    limit?: number;
    skip?: number;
}
