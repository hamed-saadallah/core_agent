"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ToolRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistry = void 0;
const common_1 = require("@nestjs/common");
let ToolRegistry = ToolRegistry_1 = class ToolRegistry {
    constructor() {
        this.logger = new common_1.Logger(ToolRegistry_1.name);
        this.tools = new Map();
    }
    registerTool(name, tool) {
        if (this.tools.has(name)) {
            this.logger.warn(`Tool "${name}" is already registered. Overwriting...`);
        }
        this.tools.set(name, tool);
        this.logger.debug(`Tool "${name}" registered successfully`);
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getAllTools() {
        return Array.from(this.tools.values());
    }
    getToolsByNames(names) {
        return names.map((name) => this.getTool(name)).filter((tool) => tool !== undefined);
    }
    hasToolFunction(name) {
        return this.tools.has(name);
    }
    unregisterTool(name) {
        const deleted = this.tools.delete(name);
        if (deleted) {
            this.logger.debug(`Tool "${name}" unregistered successfully`);
        }
        return deleted;
    }
    getRegisteredToolNames() {
        return Array.from(this.tools.keys());
    }
    clearAllTools() {
        this.tools.clear();
        this.logger.debug('All tools cleared');
    }
};
exports.ToolRegistry = ToolRegistry;
exports.ToolRegistry = ToolRegistry = ToolRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], ToolRegistry);
