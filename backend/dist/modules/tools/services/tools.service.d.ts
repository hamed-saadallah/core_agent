import { Repository } from 'typeorm';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { CreateToolDto, UpdateToolDto } from '../dtos/tool.dto';
export declare class ToolsService {
    private toolRepository;
    private readonly logger;
    constructor(toolRepository: Repository<ToolEntity>);
    create(createToolDto: CreateToolDto): Promise<ToolEntity>;
    findAll(skip?: number, limit?: number): Promise<{
        tools: ToolEntity[];
        total: number;
    }>;
    findOne(id: string): Promise<ToolEntity>;
    update(id: string, updateToolDto: UpdateToolDto): Promise<ToolEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getActiveTools(): Promise<ToolEntity[]>;
}
