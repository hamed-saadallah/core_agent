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
var SkillExecutorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExecutorService = void 0;
const common_1 = require("@nestjs/common");
const skill_runs_service_1 = require("./skill-runs.service");
let SkillExecutorService = SkillExecutorService_1 = class SkillExecutorService {
    constructor(skillRunsService) {
        this.skillRunsService = skillRunsService;
        this.logger = new common_1.Logger(SkillExecutorService_1.name);
    }
    async executeSkill(skill, input, skillRun) {
        this.logger.log(`Executing skill: ${skill.name} (type: ${skill.type})`);
        const startTime = Date.now();
        let result;
        try {
            await this.skillRunsService.updateStatus(skillRun.id, 'running');
            switch (skill.type) {
                case 'api_call':
                    result = await this.executeApiCall(skill.config, input);
                    break;
                case 'web_search':
                    result = await this.executeWebSearch(skill.config, input);
                    break;
                case 'document_parse':
                    result = await this.executeDocumentParse(skill.config, input);
                    break;
                case 'data_transform':
                    result = await this.executeDataTransform(skill.config, input);
                    break;
                case 'external_service':
                    result = await this.executeExternalService(skill.config, input);
                    break;
                default:
                    throw new common_1.BadRequestException(`Unknown skill type: ${skill.type}`);
            }
            const executionTime = Date.now() - startTime;
            await this.skillRunsService.updateStatus(skillRun.id, 'completed', result, undefined, executionTime);
            return result;
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Check if we should retry
            if (skill.retryConfig && skillRun.retryCount < skill.retryConfig.maxRetries) {
                this.logger.warn(`Skill execution failed, attempting retry. Attempt ${skillRun.retryCount + 1}/${skill.retryConfig.maxRetries}`);
                await this.skillRunsService.incrementRetry(skillRun.id);
                // Calculate backoff
                const backoffDelay = skill.retryConfig.backoffMs * Math.pow(2, skillRun.retryCount);
                // Check if error should trigger retry
                const shouldRetry = skill.retryConfig.retryOn.length === 0 || skill.retryConfig.retryOn.some((pattern) => errorMessage.includes(pattern));
                if (shouldRetry) {
                    this.logger.log(`Waiting ${backoffDelay}ms before retry...`);
                    await this.delay(backoffDelay);
                    // Recursively retry
                    const updatedRun = await this.skillRunsService.updateStatus(skillRun.id, 'retried', undefined, undefined, executionTime);
                    return this.executeSkill(skill, input, updatedRun);
                }
            }
            // Final failure
            await this.skillRunsService.updateStatus(skillRun.id, 'failed', undefined, errorMessage, executionTime);
            throw new common_1.BadRequestException(`Skill execution failed: ${errorMessage}`);
        }
    }
    async executeApiCall(config, input) {
        this.logger.debug('Executing API call skill');
        const { method = 'GET', url, headers = {}, authType, authConfig } = config;
        if (!url) {
            throw new common_1.BadRequestException('API skill must have a URL configured');
        }
        const requestHeaders = { ...headers };
        // Add authentication if configured
        if (authType === 'bearer' && authConfig?.token) {
            requestHeaders['Authorization'] = `Bearer ${authConfig.token}`;
        }
        else if (authType === 'api_key' && authConfig?.key && authConfig?.headerName) {
            requestHeaders[authConfig.headerName] = authConfig.key;
        }
        try {
            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: method !== 'GET' ? JSON.stringify(input) : undefined,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`API call failed: ${error}`);
            throw error;
        }
    }
    async executeWebSearch(config, input) {
        this.logger.debug('Executing web search skill');
        const { provider = 'google', apiKey, searchParams = {} } = config;
        const { query } = input;
        if (!query) {
            throw new common_1.BadRequestException('Web search skill requires "query" in input');
        }
        if (!apiKey) {
            throw new common_1.BadRequestException('Web search skill must have an API key configured');
        }
        // This is a placeholder implementation
        // In production, you'd integrate with Google Search API, Bing, etc.
        this.logger.warn(`Web search not fully implemented for provider: ${provider}`);
        return {
            provider,
            query,
            results: [],
            message: 'Web search implementation pending',
        };
    }
    async executeDocumentParse(config, input) {
        this.logger.debug('Executing document parse skill');
        const { format, parseRules = {} } = config;
        const { content, documentPath } = input;
        if (!content && !documentPath) {
            throw new common_1.BadRequestException('Document parse skill requires "content" or "documentPath" in input');
        }
        // This is a placeholder implementation
        // In production, you'd use libraries like pdf-parse, xml2js, etc.
        this.logger.warn(`Document parse not fully implemented for format: ${format}`);
        return {
            format,
            parsed: true,
            content: content || documentPath,
            rules: parseRules,
            message: 'Document parse implementation pending',
        };
    }
    async executeDataTransform(config, input) {
        this.logger.debug('Executing data transform skill');
        const { mappings = {} } = config;
        // Simple mapping transformation
        const result = {};
        for (const [outputKey, inputPath] of Object.entries(mappings)) {
            result[outputKey] = this.getNestedValue(input, inputPath);
        }
        return result;
    }
    async executeExternalService(config, input) {
        this.logger.debug('Executing external service skill');
        const { serviceName, endpoint, method = 'POST' } = config;
        if (!serviceName || !endpoint) {
            throw new common_1.BadRequestException('External service skill must have serviceName and endpoint configured');
        }
        // This is a placeholder implementation
        // In production, you'd implement service-specific integrations
        this.logger.warn(`External service not fully implemented for: ${serviceName}`);
        return {
            serviceName,
            endpoint,
            input,
            message: 'External service execution pending',
        };
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.SkillExecutorService = SkillExecutorService;
exports.SkillExecutorService = SkillExecutorService = SkillExecutorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [skill_runs_service_1.SkillRunsService])
], SkillExecutorService);
