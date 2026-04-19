export declare class CreateChainDto {
    name: string;
    description: string;
    startingPrompt: string;
    config?: Record<string, any>;
}
export declare class UpdateChainDto {
    name?: string;
    description?: string;
    startingPrompt?: string;
    config?: Record<string, any>;
}
export declare class AddChainNodeDto {
    agentId: string;
    order: number;
    nodeConfig?: Record<string, any>;
}
export declare class UpdateChainNodeDto {
    order?: number;
    nodeConfig?: Record<string, any>;
}
export declare class ExecuteChainDto {
    parameters: Record<string, any>;
    metadata?: Record<string, any>;
}
export declare class QueryChainsDto {
    skip?: number;
    limit?: number;
    status?: string;
}
export declare class QueryChainRunsDto {
    skip?: number;
    limit?: number;
    status?: string;
}
