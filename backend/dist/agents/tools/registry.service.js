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
var ToolRegistryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistryService = void 0;
const common_1 = require("@nestjs/common");
const tool_registry_service_1 = require("./tool-registry.service");
const built_in_tools_1 = require("./built-in.tools");
let ToolRegistryService = ToolRegistryService_1 = class ToolRegistryService {
    constructor() {
        this.logger = new common_1.Logger(ToolRegistryService_1.name);
        this.registry = new tool_registry_service_1.ToolRegistry();
        this.initializeBuiltInTools();
    }
    initializeBuiltInTools() {
        this.logger.log('Initializing built-in tools...');
        this.registry.registerTool('calculator', built_in_tools_1.calculateTool);
        this.registry.registerTool('get-current-time', built_in_tools_1.getCurrentTimeTool);
        this.registry.registerTool('reverse-string', built_in_tools_1.reverseStringTool);
        this.registry.registerTool('count-characters', built_in_tools_1.countCharactersTool);
        this.logger.log(`Built-in tools initialized: ${this.registry.getRegisteredToolNames().join(', ')}`);
    }
    getRegistry() {
        return this.registry;
    }
    registerTool(name, tool) {
        this.registry.registerTool(name, tool);
    }
    getTool(name) {
        return this.registry.getTool(name);
    }
    getAllTools() {
        return this.registry.getAllTools();
    }
    getRegisteredToolNames() {
        return this.registry.getRegisteredToolNames();
    }
};
exports.ToolRegistryService = ToolRegistryService;
exports.ToolRegistryService = ToolRegistryService = ToolRegistryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ToolRegistryService);
