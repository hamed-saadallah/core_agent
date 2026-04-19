export declare class CreateAgentDto {
    name: string;
    description: string;
    modelId: string;
    config?: Record<string, any>;
    temperature?: number;
    toolIds?: string[];
    promptId?: string;
    promptTemplate?: string;
}
export declare class UpdateAgentDto {
    name?: string;
    description?: string;
    status?: string;
    modelId?: string;
    config?: Record<string, any>;
    temperature?: number;
    toolIds?: string[];
    promptId?: string;
    promptTemplate?: string;
}
export declare class ExecuteAgentDto {
    input: any;
    metadata?: Record<string, any>;
}
export declare class ExecuteAgentWithParametersDto {
    parameters: Record<string, string>;
    metadata?: Record<string, any>;
}
