import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentsService } from '../services/agents.service';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentDto } from '../dtos/agent.dto';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

@ApiTags('agents')
@Controller('agents')
@UseFilters(AllExceptionsFilter)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  async create(@Body() createAgentDto: CreateAgentDto) {
    const userId = 'default-user-id';
    return await this.agentsService.create(createAgentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'List of agents' })
  async findAll(@Query('skip') skip?: number, @Query('limit') limit?: number) {
    return await this.agentsService.findAll(undefined, skip || 0, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent details' })
  async findOne(@Param('id') id: string) {
    return await this.agentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update agent' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  async update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return await this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  async remove(@Param('id') id: string) {
    return await this.agentsService.remove(id);
  }
}
