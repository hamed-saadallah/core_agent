import { ModelsService } from './models.service';
import { CreateModelDto } from './dtos/create-model.dto';
import { UpdateModelDto } from './dtos/update-model.dto';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    create(createModelDto: CreateModelDto, user: UserEntity): Promise<any>;
    findAll(user: UserEntity): Promise<any[]>;
    findOne(id: string, user: UserEntity): Promise<any>;
    update(id: string, updateModelDto: UpdateModelDto, user: UserEntity): Promise<any>;
    remove(id: string, user: UserEntity): Promise<void>;
    private maskApiKey;
}
