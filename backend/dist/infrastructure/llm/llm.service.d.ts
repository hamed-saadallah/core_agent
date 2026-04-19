import { LLMExecutionRequest, LLMExecutionResponse } from './types';
export declare class LLMService {
    private readonly logger;
    private readonly openaiProvider;
    private readonly mistralProvider;
    constructor();
    /**
     * Detect LLM provider type based on model name
     */
    private detectProviderType;
    /**
     * Get the appropriate provider instance
     */
    private getProvider;
    /**
     * Execute a prompt with the appropriate LLM provider
     */
    execute(request: LLMExecutionRequest): Promise<LLMExecutionResponse>;
    /**
     * Validate an API key with the appropriate provider
     */
    validateApiKey(apiKey: string, model: string): Promise<boolean>;
    /**
     * Get all supported provider types
     */
    getSupportedProviders(): string[];
}
