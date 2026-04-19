import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgentsService } from '../services/agents.service';
import { AgentSkillOrchestratorService } from '../services/agent-skill-orchestrator.service';
import { CreateAgentDto, UpdateAgentDto, ExecuteAgentDto, ExecuteAgentWithParametersDto } from '../dtos/agent.dto';
import { ExecuteWithContextDto, ExecuteWithContextResponseDto } from '../dtos/agent-execution.dto';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';

@ApiTags('agents')
@Controller('agents')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly agentSkillOrchestratorService: AgentSkillOrchestratorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  async create(@Body() createAgentDto: CreateAgentDto, @CurrentUser() user: UserEntity) {
    return await this.agentsService.create(createAgentDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'List of agents' })
  async findAll(@CurrentUser() user: UserEntity, @Query('skip') skip?: number, @Query('limit') limit?: number) {
    return await this.agentsService.findAll(user.id, skip || 0, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.agentsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update agent' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  async update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto, @CurrentUser() user: UserEntity) {
    return await this.agentsService.update(id, updateAgentDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.agentsService.remove(id, user.id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute an agent with prompt template parameters' })
  @ApiResponse({ status: 200, description: 'Agent executed successfully' })
  async execute(@Param('id') id: string, @Body() executeDto: ExecuteAgentWithParametersDto, @CurrentUser() user: UserEntity) {
    return await this.agentsService.execute(id, executeDto, user.id);
  }

  @Post(':id/execute-with-context')
  @ApiOperation({ summary: 'Execute agent with automatic context enrichment from assigned skills' })
  @ApiResponse({ status: 200, description: 'Agent executed with context enrichment', type: ExecuteWithContextResponseDto })
  async executeWithContextEnrichment(
    @Param('id') id: string,
    @Body() executeWithContextDto: ExecuteWithContextDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ExecuteWithContextResponseDto> {
    return await this.agentSkillOrchestratorService.executeAgentWithContextEnrichment(
      id,
      executeWithContextDto.userMessage,
      user.id,
    );
  }
}

