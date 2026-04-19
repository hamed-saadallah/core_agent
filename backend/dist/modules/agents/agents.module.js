"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_entity_1 = require("../../infrastructure/database/entities/agent.entity");
const tool_entity_1 = require("../../infrastructure/database/entities/tool.entity");
const prompt_entity_1 = require("../../infrastructure/database/entities/prompt.entity");
const agent_run_entity_1 = require("../../infrastructure/database/entities/agent-run.entity");
const model_entity_1 = require("../../infrastructure/database/entities/model.entity");
const agents_service_1 = require("./services/agents.service");
const agent_skill_orchestrator_service_1 = require("./services/agent-skill-orchestrator.service");
const agents_controller_1 = require("./controllers/agents.controller");
const models_module_1 = require("../models/models.module");
const auth_module_1 = require("../auth/auth.module");
const llm_module_1 = require("../../infrastructure/llm/llm.module");
const agent_runs_module_1 = require("../agent-runs/agent-runs.module");
const skills_module_1 = require("../skills/skills.module");
let AgentManagementModule = class AgentManagementModule {
};
exports.AgentManagementModule = AgentManagementModule;
exports.AgentManagementModule = AgentManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([agent_entity_1.AgentEntity, tool_entity_1.ToolEntity, prompt_entity_1.PromptEntity, agent_run_entity_1.AgentRunEntity, model_entity_1.ModelEntity]),
            models_module_1.ModelsModule,
            auth_module_1.AuthModule,
            llm_module_1.LLMModule,
            agent_runs_module_1.AgentRunsModule,
            skills_module_1.SkillsModule,
        ],
        providers: [agents_service_1.AgentsService, agent_skill_orchestrator_service_1.AgentSkillOrchestratorService],
        controllers: [agents_controller_1.AgentsController],
        exports: [agents_service_1.AgentsService, agent_skill_orchestrator_service_1.AgentSkillOrchestratorService],
    })
], AgentManagementModule);
