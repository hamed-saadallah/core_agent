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
exports.QueryAgentRunsDto = exports.CreateAgentRunDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAgentRunDto {
}
exports.CreateAgentRunDto = CreateAgentRunDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgentRunDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Run input' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateAgentRunDto.prototype, "input", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAgentRunDto.prototype, "metadata", void 0);
class QueryAgentRunsDto {
}
exports.QueryAgentRunsDto = QueryAgentRunsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agent ID filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryAgentRunsDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryAgentRunsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit results' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryAgentRunsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skip results' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryAgentRunsDto.prototype, "skip", void 0);
