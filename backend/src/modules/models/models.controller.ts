import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dtos/create-model.dto';
import { UpdateModelDto } from './dtos/update-model.dto';
import { ModelEntity } from '@/infrastructure/database/entities/model.entity';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';

@ApiTags('models')
@Controller('models')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  async create(@Body() createModelDto: CreateModelDto, @CurrentUser() user: UserEntity): Promise<any> {
    const model = await this.modelsService.create(createModelDto, user.id);
    return this.maskApiKey(model);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity): Promise<any[]> {
    const models = await this.modelsService.findAll(user.id);
    return models.map((model) => this.maskApiKey(model));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserEntity): Promise<any> {
    const model = await this.modelsService.findOne(id, user.id);
    return this.maskApiKey(model);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
    @CurrentUser() user: UserEntity,
  ): Promise<any> {
    const model = await this.modelsService.update(id, updateModelDto, user.id);
    return this.maskApiKey(model);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity): Promise<void> {
    await this.modelsService.remove(id, user.id);
  }

  private maskApiKey(model: ModelEntity): any {
    const modelObj = { ...model };
    if (modelObj.apiKey) {
      modelObj.apiKey = '***';
    }
    return modelObj;
  }
}
