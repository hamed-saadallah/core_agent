"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AgentRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistry = void 0;
const common_1 = require("@nestjs/common");
let AgentRegistry = AgentRegistry_1 = class AgentRegistry {
    constructor() {
        this.logger = new common_1.Logger(AgentRegistry_1.name);
        this.agents = new Map();
    }
    registerAgent(agent) {
        const name = agent.getName();
        if (this.agents.has(name)) {
            this.logger.warn(`Agent "${name}" is already registered. Overwriting...`);
        }
        this.agents.set(name, agent);
        this.logger.debug(`Agent "${name}" registered successfully`);
    }
    getAgent(name) {
        return this.agents.get(name);
    }
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    hasAgent(name) {
        return this.agents.has(name);
    }
    unregisterAgent(name) {
        const deleted = this.agents.delete(name);
        if (deleted) {
            this.logger.debug(`Agent "${name}" unregistered successfully`);
        }
        return deleted;
    }
    getRegisteredAgentNames() {
        return Array.from(this.agents.keys());
    }
    getAgentsByNames(names) {
        return names.map((name) => this.getAgent(name)).filter((agent) => agent !== undefined);
    }
    clearAllAgents() {
        this.agents.clear();
        this.logger.debug('All agents cleared');
    }
};
exports.AgentRegistry = AgentRegistry;
exports.AgentRegistry = AgentRegistry = AgentRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], AgentRegistry);
