import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dtos/create-model.dto';
import { UpdateModelDto } from './dtos/update-model.dto';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  async create(@Body() createModelDto: CreateModelDto): Promise<any> {
    const model = await this.modelsService.create(createModelDto, null);
    return this.maskApiKey(model);
  }

  @Get()
  async findAll(): Promise<any[]> {
    const models = await this.modelsService.findAll(null);
    return models.map((model) => this.maskApiKey(model));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const model = await this.modelsService.findOneById(id);
    return this.maskApiKey(model);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<any> {
    const model = await this.modelsService.update(id, updateModelDto, null);
    return this.maskApiKey(model);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.modelsService.remove(id, null);
  }

  private maskApiKey(model: ModelEntity): any {
    const modelObj = { ...model };
    if (modelObj.apiKey) {
      modelObj.apiKey = '***';
    }
    return modelObj;
  }
}
