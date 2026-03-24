import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangChainConfigService {
  constructor(private configService: ConfigService) {}

  getOpenAIApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY', '');
  }

  getLangChainApiKey(): string {
    return this.configService.get<string>('LANGCHAIN_API_KEY', '');
  }

  getModel(): string {
    return this.configService.get<string>('LANGCHAIN_MODEL', 'gpt-3.5-turbo');
  }

  getTemperature(): number {
    return this.configService.get<number>('LANGCHAIN_TEMPERATURE', 0.7);
  }
}
