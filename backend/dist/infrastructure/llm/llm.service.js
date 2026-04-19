"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LLMService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const common_1 = require("@nestjs/common");
const openai_provider_1 = require("./providers/openai.provider");
const mistral_provider_1 = require("./providers/mistral.provider");
const types_1 = require("./types");
let LLMService = LLMService_1 = class LLMService {
    constructor() {
        this.logger = new common_1.Logger(LLMService_1.name);
        this.openaiProvider = new openai_provider_1.OpenAIProvider();
        this.mistralProvider = new mistral_provider_1.MistralProvider();
    }
    /**
     * Detect LLM provider type based on model name
     */
    detectProviderType(model) {
        const lowerModel = model.toLowerCase();
        if (lowerModel.includes('gpt') || lowerModel.includes('openai')) {
            return types_1.LLMProviderType.OPENAI;
        }
        if (lowerModel.includes('mistral')) {
            return types_1.LLMProviderType.MISTRAL;
        }
        // Default to OpenAI if provider cannot be determined
        return types_1.LLMProviderType.OPENAI;
    }
    /**
     * Get the appropriate provider instance
     */
    getProvider(providerType) {
        switch (providerType) {
            case types_1.LLMProviderType.OPENAI:
                return this.openaiProvider;
            case types_1.LLMProviderType.MISTRAL:
                return this.mistralProvider;
            default:
                throw new common_1.BadRequestException(`Unsupported LLM provider: ${providerType}`);
        }
    }
    /**
     * Execute a prompt with the appropriate LLM provider
     */
    async execute(request) {
        try {
            const providerType = this.detectProviderType(request.model);
            this.logger.log(`Using ${providerType} provider for model: ${request.model}`);
            const provider = this.getProvider(providerType);
            const response = await provider.execute(request);
            this.logger.log(`LLM execution successful for model ${request.model}, tokens used: ${response.totalTokens}`);
            return response;
        }
        catch (error) {
            this.logger.error(`LLM execution failed: ${error}`);
            throw error;
        }
    }
    /**
     * Validate an API key with the appropriate provider
     */
    async validateApiKey(apiKey, model) {
        try {
            const providerType = this.detectProviderType(model);
            const provider = this.getProvider(providerType);
            return await provider.validateApiKey(apiKey);
        }
        catch (error) {
            this.logger.error(`API key validation failed: ${error}`);
            return false;
        }
    }
    /**
     * Get all supported provider types
     */
    getSupportedProviders() {
        return Object.values(types_1.LLMProviderType);
    }
};
exports.LLMService = LLMService;
exports.LLMService = LLMService = LLMService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LLMService);
