"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OpenAIProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const common_1 = require("@nestjs/common");
let OpenAIProvider = OpenAIProvider_1 = class OpenAIProvider {
    constructor() {
        this.logger = new common_1.Logger(OpenAIProvider_1.name);
    }
    async execute(request) {
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
                    const error = (await response.json());
                    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
                }
                const data = (await response.json());
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
            }
            catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }
        catch (error) {
            this.logger.error(`OpenAI execution failed: ${error}`);
            throw error;
        }
    }
    async validateApiKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
};
exports.OpenAIProvider = OpenAIProvider;
exports.OpenAIProvider = OpenAIProvider = OpenAIProvider_1 = __decorate([
    (0, common_1.Injectable)()
], OpenAIProvider);
