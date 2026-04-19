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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteAgentWithParametersDto = exports.ExecuteAgentDto = exports.UpdateAgentDto = exports.CreateAgentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAgentDto {
}
exports.CreateAgentDto = CreateAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Model ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "modelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent configuration' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAgentDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Temperature for LLM (deprecated, use model temperature)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tool IDs to assign' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAgentDto.prototype, "toolIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prompt ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "promptId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prompt template with parameter placeholders like {param}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "promptTemplate", void 0);
class UpdateAgentDto {
}
exports.UpdateAgentDto = UpdateAgentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Model ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "modelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent configuration' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAgentDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Temperature for LLM (deprecated, use model temperature)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], UpdateAgentDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tool IDs to assign' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateAgentDto.prototype, "toolIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prompt ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "promptId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prompt template with parameter placeholders like {param}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAgentDto.prototype, "promptTemplate", void 0);
class ExecuteAgentDto {
}
exports.ExecuteAgentDto = ExecuteAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent input/query' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ExecuteAgentDto.prototype, "input", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ExecuteAgentDto.prototype, "metadata", void 0);
class ExecuteAgentWithParametersDto {
}
exports.ExecuteAgentWithParametersDto = ExecuteAgentWithParametersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Parameters to fill template placeholders' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ExecuteAgentWithParametersDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ExecuteAgentWithParametersDto.prototype, "metadata", void 0);
