"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRunsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_run_entity_1 = require("../../infrastructure/database/entities/agent-run.entity");
const model_entity_1 = require("../../infrastructure/database/entities/model.entity");
const agent_entity_1 = require("../../infrastructure/database/entities/agent.entity");
const agent_runs_service_1 = require("./services/agent-runs.service");
const agent_runs_controller_1 = require("./controllers/agent-runs.controller");
const llm_module_1 = require("../../infrastructure/llm/llm.module");
const models_module_1 = require("../models/models.module");
const auth_module_1 = require("../auth/auth.module");
let AgentRunsModule = class AgentRunsModule {
};
exports.AgentRunsModule = AgentRunsModule;
exports.AgentRunsModule = AgentRunsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([agent_run_entity_1.AgentRunEntity, model_entity_1.ModelEntity, agent_entity_1.AgentEntity]),
            llm_module_1.LLMModule,
            models_module_1.ModelsModule,
            auth_module_1.AuthModule,
        ],
        providers: [agent_runs_service_1.AgentRunsService],
        controllers: [agent_runs_controller_1.AgentRunsController],
        exports: [agent_runs_service_1.AgentRunsService],
    })
], AgentRunsModule);
