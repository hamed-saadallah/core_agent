import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { MistralProvider } from './providers/mistral.provider';
import { LLMProvider, LLMExecutionRequest, LLMExecutionResponse, LLMProviderType } from './types';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly openaiProvider: OpenAIProvider;
  private readonly mistralProvider: MistralProvider;

  constructor() {
    this.openaiProvider = new OpenAIProvider();
    this.mistralProvider = new MistralProvider();
  }

  /**
   * Detect LLM provider type based on model name
   */
  private detectProviderType(model: string): LLMProviderType {
    const lowerModel = model.toLowerCase();

    if (lowerModel.includes('gpt') || lowerModel.includes('openai')) {
      return LLMProviderType.OPENAI;
    }

    if (lowerModel.includes('mistral')) {
      return LLMProviderType.MISTRAL;
    }

    // Default to OpenAI if provider cannot be determined
    return LLMProviderType.OPENAI;
  }

  /**
   * Get the appropriate provider instance
   */
  private getProvider(providerType: LLMProviderType): LLMProvider {
    switch (providerType) {
      case LLMProviderType.OPENAI:
        return this.openaiProvider;
      case LLMProviderType.MISTRAL:
        return this.mistralProvider;
      default:
        throw new BadRequestException(`Unsupported LLM provider: ${providerType}`);
    }
  }

  /**
   * Execute a prompt with the appropriate LLM provider
   */
  async execute(request: LLMExecutionRequest): Promise<LLMExecutionResponse> {
    try {
      const providerType = this.detectProviderType(request.model);
      this.logger.log(`Using ${providerType} provider for model: ${request.model}`);

      const provider = this.getProvider(providerType);
      const response = await provider.execute(request);

      this.logger.log(
        `LLM execution successful for model ${request.model}, tokens used: ${response.totalTokens}`,
      );

      return response;
    } catch (error) {
      this.logger.error(`LLM execution failed: ${error}`);
      throw error;
    }
  }

  /**
   * Validate an API key with the appropriate provider
   */
  async validateApiKey(apiKey: string, model: string): Promise<boolean> {
    try {
      const providerType = this.detectProviderType(model);
      const provider = this.getProvider(providerType);
      return await provider.validateApiKey(apiKey);
    } catch (error) {
      this.logger.error(`API key validation failed: ${error}`);
      return false;
    }
  }

  /**
   * Get all supported provider types
   */
  getSupportedProviders(): string[] {
    return Object.values(LLMProviderType);
  }
}
