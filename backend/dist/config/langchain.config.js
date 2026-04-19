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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangChainConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let LangChainConfigService = class LangChainConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    getOpenAIApiKey() {
        return this.configService.get('OPENAI_API_KEY', '');
    }
    getLangChainApiKey() {
        return this.configService.get('LANGCHAIN_API_KEY', '');
    }
    getModel() {
        return this.configService.get('LANGCHAIN_MODEL', 'gpt-3.5-turbo');
    }
    getTemperature() {
        return this.configService.get('LANGCHAIN_TEMPERATURE', 0.7);
    }
};
exports.LangChainConfigService = LangChainConfigService;
exports.LangChainConfigService = LangChainConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LangChainConfigService);
