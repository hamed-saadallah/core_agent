import { Repository } from 'typeorm';
import { ModelEntity } from '../../infrastructure/database/entities/model.entity';
import { CreateModelDto } from './dtos/create-model.dto';
import { UpdateModelDto } from './dtos/update-model.dto';
export declare class ModelsService {
    private modelsRepository;
    private readonly encryptionSecret;
    constructor(modelsRepository: Repository<ModelEntity>);
    create(createModelDto: CreateModelDto, ownerId: string): Promise<ModelEntity>;
    findAll(ownerId: string): Promise<ModelEntity[]>;
    findOne(id: string, ownerId: string): Promise<ModelEntity>;
    findOneById(id: string, ownerId?: string): Promise<ModelEntity>;
    update(id: string, updateModelDto: UpdateModelDto, ownerId: string): Promise<ModelEntity>;
    remove(id: string, ownerId: string): Promise<void>;
    decryptApiKey(model: ModelEntity): string;
}
