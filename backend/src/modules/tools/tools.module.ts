import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolEntity } from '@/infrastructure/database/entities/tool.entity';
import { ToolsService } from './services/tools.service';
import { ToolsController } from './controllers/tools.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ToolEntity])],
  providers: [ToolsService],
  controllers: [ToolsController],
  exports: [ToolsService],
})
export class ToolsManagementModule {}
