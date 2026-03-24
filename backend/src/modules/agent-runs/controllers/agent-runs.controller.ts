import { Controller, Get, Post, Body, Param, Query, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentRunsService } from '../services/agent-runs.service';
import { CreateAgentRunDto, QueryAgentRunsDto } from '../dtos/agent-run.dto';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

@ApiTags('agent-runs')
@Controller('agent-runs')
@UseFilters(AllExceptionsFilter)
export class AgentRunsController {
  constructor(private readonly agentRunsService: AgentRunsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent run' })
  @ApiResponse({ status: 201, description: 'Agent run created successfully' })
  async create(@Body() createAgentRunDto: CreateAgentRunDto) {
    const userId = 'default-user-id';
    return await this.agentRunsService.create(createAgentRunDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agent runs' })
  @ApiResponse({ status: 200, description: 'List of agent runs' })
  async findAll(
    @Query('agentId') agentId?: string,
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.agentRunsService.findAll({
      agentId,
      status,
      skip: skip || 0,
      limit: limit || 10,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent run by ID' })
  @ApiResponse({ status: 200, description: 'Agent run details' })
  async findOne(@Param('id') id: string) {
    return await this.agentRunsService.findOne(id);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get agent runs by agent ID' })
  @ApiResponse({ status: 200, description: 'List of agent runs' })
  async getRunsByAgent(@Param('agentId') agentId: string, @Query('skip') skip?: number, @Query('limit') limit?: number) {
    return await this.agentRunsService.getRunsByAgent(agentId, skip || 0, limit || 10);
  }
}
