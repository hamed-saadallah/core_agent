import { ConfigService } from '@nestjs/config';
export declare class LangChainConfigService {
    private configService;
    constructor(configService: ConfigService);
    getOpenAIApiKey(): string;
    getLangChainApiKey(): string;
    getModel(): string;
    getTemperature(): number;
}
