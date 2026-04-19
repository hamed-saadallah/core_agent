"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const common_1 = require("@nestjs/common");
class BaseAgent {
    constructor(config) {
        this.executor = null;
        this.config = config;
        this.logger = new common_1.Logger(config.name);
    }
    getName() {
        return this.config.name;
    }
    getDescription() {
        return this.config.description || '';
    }
    getTools() {
        return this.config.tools;
    }
    getConfig() {
        return this.config;
    }
    async measureExecutionTime(fn) {
        const startTime = Date.now();
        const result = await fn();
        const duration = Date.now() - startTime;
        return { result, duration };
    }
    logExecution(result) {
        if (result.success) {
            this.logger.debug(`Execution completed in ${result.executionTime}ms`);
        }
        else {
            this.logger.error(`Execution failed: ${result.error}`, result.error);
        }
    }
    async cleanup() {
        this.logger.debug('Cleaning up agent resources');
    }
}
exports.BaseAgent = BaseAgent;
