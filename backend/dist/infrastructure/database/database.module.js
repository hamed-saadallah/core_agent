"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("../../config/database.config");
const user_entity_1 = require("./entities/user.entity");
const agent_entity_1 = require("./entities/agent.entity");
const tool_entity_1 = require("./entities/tool.entity");
const prompt_entity_1 = require("./entities/prompt.entity");
const agent_run_entity_1 = require("./entities/agent-run.entity");
const model_entity_1 = require("./entities/model.entity");
const plan_entity_1 = require("./entities/plan.entity");
const profile_entity_1 = require("./entities/profile.entity");
const email_verification_entity_1 = require("./entities/email-verification.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (configService) => configService.getDatabaseConfig(),
                inject: [database_config_1.DatabaseConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                agent_entity_1.AgentEntity,
                tool_entity_1.ToolEntity,
                prompt_entity_1.PromptEntity,
                agent_run_entity_1.AgentRunEntity,
                model_entity_1.ModelEntity,
                plan_entity_1.PlanEntity,
                profile_entity_1.ProfileEntity,
                email_verification_entity_1.EmailVerificationEntity,
            ]),
        ],
        providers: [database_config_1.DatabaseConfigService],
        exports: [database_config_1.DatabaseConfigService, typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
