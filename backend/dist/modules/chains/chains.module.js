"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chain_entity_1 = require("../../infrastructure/database/entities/chain.entity");
const chain_node_entity_1 = require("../../infrastructure/database/entities/chain-node.entity");
const chain_run_entity_1 = require("../../infrastructure/database/entities/chain-run.entity");
const agent_entity_1 = require("../../infrastructure/database/entities/agent.entity");
const chains_service_1 = require("./services/chains.service");
const chain_nodes_service_1 = require("./services/chain-nodes.service");
const chain_runs_service_1 = require("./services/chain-runs.service");
const chains_controller_1 = require("./controllers/chains.controller");
const agent_runs_module_1 = require("../agent-runs/agent-runs.module");
let ChainsModule = class ChainsModule {
};
exports.ChainsModule = ChainsModule;
exports.ChainsModule = ChainsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chain_entity_1.ChainEntity, chain_node_entity_1.ChainNodeEntity, chain_run_entity_1.ChainRunEntity, agent_entity_1.AgentEntity]), agent_runs_module_1.AgentRunsModule],
        providers: [chains_service_1.ChainsService, chain_nodes_service_1.ChainNodesService, chain_runs_service_1.ChainRunsService],
        controllers: [chains_controller_1.ChainsController],
        exports: [chains_service_1.ChainsService, chain_nodes_service_1.ChainNodesService, chain_runs_service_1.ChainRunsService],
    })
], ChainsModule);
