import { LLMProvider, LLMExecutionRequest, LLMExecutionResponse } from '../types';
export declare class OpenAIProvider implements LLMProvider {
    private readonly logger;
    execute(request: LLMExecutionRequest): Promise<LLMExecutionResponse>;
    validateApiKey(apiKey: string): Promise<boolean>;
}
