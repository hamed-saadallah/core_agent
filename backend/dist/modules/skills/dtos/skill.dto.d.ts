export declare class CreateSkillDto {
    name: string;
    description: string;
    type: 'api_call' | 'web_search' | 'document_parse' | 'data_transform' | 'external_service';
    config: Record<string, any>;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    retryConfig?: {
        maxRetries: number;
        backoffMs: number;
        retryOn: string[];
    };
    timeout?: number;
}
export declare class UpdateSkillDto {
    name?: string;
    description?: string;
    config?: Record<string, any>;
    status?: string;
    retryConfig?: {
        maxRetries: number;
        backoffMs: number;
        retryOn: string[];
    };
    timeout?: number;
}
export declare class ExecuteSkillDto {
    input: Record<string, any>;
    metadata?: Record<string, any>;
}
export declare class QuerySkillsDto {
    skip?: number;
    limit?: number;
    status?: string;
    type?: string;
}
