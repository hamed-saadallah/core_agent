import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { OpenAIProvider } from './providers/openai.provider';
import { MistralProvider } from './providers/mistral.provider';

@Module({
  providers: [LLMService, OpenAIProvider, MistralProvider],
  exports: [LLMService],
})
export class LLMModule {}
