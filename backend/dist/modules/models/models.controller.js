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
exports.ModelsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const models_service_1 = require("./models.service");
const create_model_dto_1 = require("./dtos/create-model.dto");
const update_model_dto_1 = require("./dtos/update-model.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../infrastructure/database/entities/user.entity");
let ModelsController = class ModelsController {
    constructor(modelsService) {
        this.modelsService = modelsService;
    }
    async create(createModelDto, user) {
        const model = await this.modelsService.create(createModelDto, user.id);
        return this.maskApiKey(model);
    }
    async findAll(user) {
        const models = await this.modelsService.findAll(user.id);
        return models.map((model) => this.maskApiKey(model));
    }
    async findOne(id, user) {
        const model = await this.modelsService.findOne(id, user.id);
        return this.maskApiKey(model);
    }
    async update(id, updateModelDto, user) {
        const model = await this.modelsService.update(id, updateModelDto, user.id);
        return this.maskApiKey(model);
    }
    async remove(id, user) {
        await this.modelsService.remove(id, user.id);
    }
    maskApiKey(model) {
        const modelObj = { ...model };
        if (modelObj.apiKey) {
            modelObj.apiKey = '***';
        }
        return modelObj;
    }
};
exports.ModelsController = ModelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_model_dto_1.CreateModelDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_model_dto_1.UpdateModelDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "remove", null);
exports.ModelsController = ModelsController = __decorate([
    (0, swagger_1.ApiTags)('models'),
    (0, common_1.Controller)('models'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [models_service_1.ModelsService])
], ModelsController);
