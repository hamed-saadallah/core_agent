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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plan_entity_1 = require("../../infrastructure/database/entities/plan.entity");
let InitializationService = class InitializationService {
    constructor(plansRepository) {
        this.plansRepository = plansRepository;
    }
    async onModuleInit() {
        await this.initializeDefaultPlan();
    }
    async initializeDefaultPlan() {
        try {
            const existingPlan = await this.plansRepository.findOne({
                where: { name: 'Free' },
            });
            if (!existingPlan) {
                const freePlan = this.plansRepository.create({
                    name: 'Free',
                    maxAgents: 10,
                });
                await this.plansRepository.save(freePlan);
                console.log('Default Free plan created successfully');
            }
        }
        catch (error) {
            console.error('Failed to initialize default plan:', error);
        }
    }
};
exports.InitializationService = InitializationService;
exports.InitializationService = InitializationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plan_entity_1.PlanEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InitializationService);
