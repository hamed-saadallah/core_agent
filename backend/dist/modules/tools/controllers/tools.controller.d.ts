import { ToolsService } from '../services/tools.service';
import { CreateToolDto, UpdateToolDto } from '../dtos/tool.dto';
export declare class ToolsController {
    private readonly toolsService;
    constructor(toolsService: ToolsService);
    create(createToolDto: CreateToolDto): Promise<import("../../../infrastructure/database/entities/tool.entity").ToolEntity>;
    findAll(skip?: number, limit?: number): Promise<{
        tools: import("../../../infrastructure/database/entities/tool.entity").ToolEntity[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../../../infrastructure/database/entities/tool.entity").ToolEntity>;
    update(id: string, updateToolDto: UpdateToolDto): Promise<import("../../../infrastructure/database/entities/tool.entity").ToolEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getActiveTools(): Promise<import("../../../infrastructure/database/entities/tool.entity").ToolEntity[]>;
}
