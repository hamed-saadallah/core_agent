import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ToolsService } from '../services/tools.service';
import { CreateToolDto, UpdateToolDto } from '../dtos/tool.dto';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

@ApiTags('tools')
@Controller('tools')
@UseFilters(AllExceptionsFilter)
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tool' })
  @ApiResponse({ status: 201, description: 'Tool created successfully' })
  async create(@Body() createToolDto: CreateToolDto) {
    return await this.toolsService.create(createToolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tools' })
  @ApiResponse({ status: 200, description: 'List of tools' })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    return await this.toolsService.findAll(skip || 0, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tool by ID' })
  @ApiResponse({ status: 200, description: 'Tool details' })
  async findOne(@Param('id') id: string) {
    return await this.toolsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tool' })
  @ApiResponse({ status: 200, description: 'Tool updated successfully' })
  async update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return await this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tool' })
  @ApiResponse({ status: 200, description: 'Tool deleted successfully' })
  async remove(@Param('id') id: string) {
    return await this.toolsService.remove(id);
  }

  @Get('active/list')
  @ApiOperation({ summary: 'Get all active tools' })
  @ApiResponse({ status: 200, description: 'List of active tools' })
  async getActiveTools() {
    return await this.toolsService.getActiveTools();
  }
}
