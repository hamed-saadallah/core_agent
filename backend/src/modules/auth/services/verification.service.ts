import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from '@/infrastructure/database/entities/email-verification.entity';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private verificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  generateCode(): string {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
  }

  async storeVerificationCode(user: UserEntity, code: string): Promise<EmailVerificationEntity> {
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

  async verifyCode(user: UserEntity, code: string): Promise<boolean> {
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

  async isEmailVerified(user: UserEntity): Promise<boolean> {
    const verification = await this.verificationRepository.findOne({
      where: { user: { id: user.id } },
    });

    return verification?.isVerified ?? false;
  }
}
