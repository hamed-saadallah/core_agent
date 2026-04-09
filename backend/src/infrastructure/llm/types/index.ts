export interface LLMExecutionRequest {
  prompt: string;
  temperature: number;
  model: string;
  apiKey: string;
  maxTokens?: number;
  timeout?: number;
}

export interface LLMExecutionResponse {
  output: string;
  model: string;
  temperature: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  finishReason?: string;
}

export interface LLMProvider {
  execute(request: LLMExecutionRequest): Promise<LLMExecutionResponse>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

export enum LLMProviderType {
  OPENAI = 'openai',
  MISTRAL = 'mistral',
  ANTHROPIC = 'anthropic',
}
