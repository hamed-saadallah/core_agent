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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_verification_entity_1 = require("../../../infrastructure/database/entities/email-verification.entity");
let VerificationService = class VerificationService {
    constructor(verificationRepository) {
        this.verificationRepository = verificationRepository;
    }
    generateCode() {
        return Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');
    }
    async storeVerificationCode(user, code) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const existingVerification = await this.verificationRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (existingVerification) {
            existingVerification.code = code;
            existingVerification.expiresAt = expiresAt;
            existingVerification.isVerified = false;
            return this.verificationRepository.save(existingVerification);
        }
        const verification = this.verificationRepository.create({
            user,
            code,
            expiresAt,
            isVerified: false,
        });
        return this.verificationRepository.save(verification);
    }
    async verifyCode(user, code) {
        const verification = await this.verificationRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (!verification) {
            return false;
        }
        if (verification.isVerified) {
            return true;
        }
        if (verification.expiresAt < new Date()) {
            return false;
        }
        if (verification.code !== code) {
            return false;
        }
        verification.isVerified = true;
        await this.verificationRepository.save(verification);
        return true;
    }
    async isEmailVerified(user) {
        const verification = await this.verificationRepository.findOne({
            where: { user: { id: user.id } },
        });
        return verification?.isVerified ?? false;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_verification_entity_1.EmailVerificationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VerificationService);
