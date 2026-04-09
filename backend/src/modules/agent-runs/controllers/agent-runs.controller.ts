import { Controller, Get, Post, Body, Param, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AgentRunsService } from '../services/agent-runs.service';
import { CreateAgentRunDto, QueryAgentRunsDto } from '../dtos/agent-run.dto';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('agent-runs')
@Controller('agent-runs')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AgentRunsController {
  constructor(private readonly agentRunsService: AgentRunsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent run' })
  @ApiResponse({ status: 201, description: 'Agent run created successfully' })
  async create(@Body() createAgentRunDto: CreateAgentRunDto, @CurrentUser() user: any) {
    return await this.agentRunsService.create(createAgentRunDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agent runs' })
  @ApiResponse({ status: 200, description: 'List of agent runs' })
  async findAll(
    @Query('agentId') agentId?: string,
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: any,
  ) {
    return await this.agentRunsService.findAll({
      agentId,
      status,
      skip: skip || 0,
      limit: limit || 10,
      userId: user?.id,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent run by ID' })
  @ApiResponse({ status: 200, description: 'Agent run details' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return await this.agentRunsService.findOne(id, user?.id);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get agent runs by agent ID' })
  @ApiResponse({ status: 200, description: 'List of agent runs' })
  async getRunsByAgent(
    @Param('agentId') agentId: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: any,
  ) {
    return await this.agentRunsService.getRunsByAgent(agentId, skip || 0, limit || 10, user?.id);
  }
}
