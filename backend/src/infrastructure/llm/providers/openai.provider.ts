import { Injectable, Logger } from '@nestjs/common';
import { LLMProvider, LLMExecutionRequest, LLMExecutionResponse } from '../types';

interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

@Injectable()
export class OpenAIProvider implements LLMProvider {
  private readonly logger = new Logger(OpenAIProvider.name);

  async execute(request: LLMExecutionRequest): Promise<LLMExecutionResponse> {
    try {
      const { prompt, temperature, model, apiKey, maxTokens = 2000, timeout = 30000 } = request;

      this.logger.debug(`Executing OpenAI request with model: ${model}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = (await response.json()) as OpenAIErrorResponse;
          throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = (await response.json()) as OpenAIResponse;

        if (!data.choices || !data.choices[0]) {
          throw new Error('Invalid response from OpenAI API');
        }

        const output = data.choices[0].message?.content || '';

        return {
          output,
          model,
          temperature,
          inputTokens: data.usage?.prompt_tokens,
          outputTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
          finishReason: data.choices[0].finish_reason,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      this.logger.error(`OpenAI execution failed: ${error}`);
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
