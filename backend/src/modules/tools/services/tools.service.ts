import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { CreateToolDto, UpdateToolDto } from '../dtos/tool.dto';

@Injectable()
export class ToolsService {
  private readonly logger = new Logger(ToolsService.name);

  constructor(@InjectRepository(ToolEntity) private toolRepository: Repository<ToolEntity>) {}

  async create(createToolDto: CreateToolDto): Promise<ToolEntity> {
    this.logger.log(`Creating tool: ${createToolDto.name}`);

    const tool = this.toolRepository.create({
      ...createToolDto,
      isActive: true,
    });

    return await this.toolRepository.save(tool);
  }

  async findAll(skip = 0, limit = 10): Promise<{ tools: ToolEntity[]; total: number }> {
    const [tools, total] = await this.toolRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { tools, total };
  }

  async findOne(id: string): Promise<ToolEntity> {
    const tool = await this.toolRepository.findOne({ where: { id } });
    if (!tool) {
      throw new NotFoundException(`Tool with ID ${id} not found`);
    }
    return tool;
  }

  async update(id: string, updateToolDto: UpdateToolDto): Promise<ToolEntity> {
    this.logger.log(`Updating tool: ${id}`);

    const tool = await this.findOne(id);
    Object.assign(tool, updateToolDto);

    return await this.toolRepository.save(tool);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    this.logger.log(`Deleting tool: ${id}`);
    const result = await this.toolRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tool with ID ${id} not found`);
    }
    return { success: true };
  }

  async getActiveTools(): Promise<ToolEntity[]> {
    return await this.toolRepository.find({ where: { isActive: true } });
  }
}
