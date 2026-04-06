import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { CreateModelDto } from './dtos/create-model.dto';
import { UpdateModelDto } from './dtos/update-model.dto';
import { EncryptionUtil } from '@/common/utils/encryption.util';
import { getEnvironmentVariables } from '@/config/environment';

@Injectable()
export class ModelsService {
  private readonly encryptionSecret = getEnvironmentVariables().JWT_SECRET || 'secret-key';

  constructor(
    @InjectRepository(ModelEntity)
    private modelsRepository: Repository<ModelEntity>,
  ) {}

  async create(createModelDto: CreateModelDto, ownerId: string): Promise<ModelEntity> {
    const encryptedApiKey = EncryptionUtil.encrypt(createModelDto.apiKey, this.encryptionSecret);

    const model = this.modelsRepository.create({
      ...createModelDto,
      apiKey: encryptedApiKey,
      status: createModelDto.status || 'enabled',
      temperature: createModelDto.temperature || 0.7,
      ownerId,
    });

    return await this.modelsRepository.save(model);
  }

  async findAll(ownerId: string): Promise<ModelEntity[]> {
    return await this.modelsRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<ModelEntity> {
    const model = await this.modelsRepository.findOne({
      where: { id, ownerId },
    });

    if (!model) {
      throw new NotFoundException(`Model with id ${id} not found`);
    }

    return model;
  }

  async findOneById(id: string, ownerId?: string): Promise<ModelEntity> {
    const model = await this.modelsRepository.findOne({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException(`Model with id ${id} not found`);
    }

    // Check ownership if ownerId is provided
    if (ownerId && model.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to access this model');
    }

    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto, ownerId: string): Promise<ModelEntity> {
    const model = await this.findOneById(id, ownerId);

    if (updateModelDto.apiKey) {
      updateModelDto.apiKey = EncryptionUtil.encrypt(updateModelDto.apiKey, this.encryptionSecret);
    }

    Object.assign(model, updateModelDto);
    return await this.modelsRepository.save(model);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const model = await this.findOneById(id, ownerId);

    const agentCount = await this.modelsRepository.query(
      'SELECT COUNT(*) FROM agents WHERE "modelId" = $1',
      [id],
    );

    if (agentCount[0]?.count > 0) {
      throw new BadRequestException('Cannot delete model that is in use by agents');
    }

    await this.modelsRepository.remove(model);
  }

  decryptApiKey(model: ModelEntity): string {
    return EncryptionUtil.decrypt(model.apiKey, this.encryptionSecret);
  }
}
