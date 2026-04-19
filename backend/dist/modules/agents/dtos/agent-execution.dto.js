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
exports.ExecuteWithContextResponseDto = exports.ExecuteWithContextDto = exports.SkillContextDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SkillContextDto {
}
exports.SkillContextDto = SkillContextDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the skill executed' }),
    __metadata("design:type", String)
], SkillContextDto.prototype, "skillName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Output data from skill execution' }),
    __metadata("design:type", Object)
], SkillContextDto.prototype, "output", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Error message if skill failed', required: false }),
    __metadata("design:type", String)
], SkillContextDto.prototype, "error", void 0);
class ExecuteWithContextDto {
}
exports.ExecuteWithContextDto = ExecuteWithContextDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User message to send to the agent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ExecuteWithContextDto.prototype, "userMessage", void 0);
class ExecuteWithContextResponseDto {
}
exports.ExecuteWithContextResponseDto = ExecuteWithContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response from the agent' }),
    __metadata("design:type", String)
], ExecuteWithContextResponseDto.prototype, "response", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of skills that were executed' }),
    __metadata("design:type", Array)
], ExecuteWithContextResponseDto.prototype, "skillsUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed information about each skill executed' }),
    __metadata("design:type", Array)
], ExecuteWithContextResponseDto.prototype, "skillDetails", void 0);
