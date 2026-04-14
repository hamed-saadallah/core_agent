import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { SkillsService } from '../services/skills.service';
import { SkillExecutorService } from '../services/skill-executor.service';
import { SkillRunsService } from '../services/skill-runs.service';
import { CreateSkillDto, UpdateSkillDto, ExecuteSkillDto, QuerySkillsDto } from '../dtos/skill.dto';

@Controller('skills')
@UseGuards(AuthGuard('jwt'))
@UseFilters(AllExceptionsFilter)
export class SkillsController {
  constructor(
    private skillsService: SkillsService,
    private skillExecutorService: SkillExecutorService,
    private skillRunsService: SkillRunsService,
  ) {}

  @Get()
  async getSkills(
    @CurrentUser() user: UserEntity,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return await this.skillsService.findAll(user.id, {
      skip: skip || 0,
      limit: limit || 10,
      status,
      type,
    });
  }

  @Post()
  async createSkill(@Body() createSkillDto: CreateSkillDto, @CurrentUser() user: UserEntity) {
    return await this.skillsService.create(createSkillDto, user.id);
  }

  @Get(':id')
  async getSkill(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.skillsService.findOne(id, user.id);
  }

  @Put(':id')
  async updateSkill(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto, @CurrentUser() user: UserEntity) {
    return await this.skillsService.update(id, updateSkillDto, user.id);
  }

  @Delete(':id')
  async deleteSkill(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    await this.skillsService.delete(id, user.id);
    return { success: true };
  }

  @Post(':id/execute')
  async executeSkill(@Param('id') skillId: string, @Body() executeSkillDto: ExecuteSkillDto, @CurrentUser() user: UserEntity) {
    // Get the skill
    const skill = await this.skillsService.findOne(skillId, user.id);

    // Create a skill run record
    const skillRun = await this.skillRunsService.create(skillId, user.id, executeSkillDto.input, executeSkillDto.metadata);

    // Execute the skill
    const output = await this.skillExecutorService.executeSkill(skill, executeSkillDto.input, skillRun);

    // Get the updated run
    const updatedRun = await this.skillRunsService.findOne(skillRun.id, user.id);

    return {
      success: true,
      output,
      runId: updatedRun.id,
      executionTime: updatedRun.executionTime,
    };
  }

  @Post(':id/agents/:agentId')
  async assignToAgent(@Param('id') skillId: string, @Param('agentId') agentId: string, @CurrentUser() user: UserEntity) {
    return await this.skillsService.assignToAgent(skillId, agentId, user.id);
  }

  @Delete(':id/agents/:agentId')
  async removeFromAgent(@Param('id') skillId: string, @Param('agentId') agentId: string, @CurrentUser() user: UserEntity) {
    await this.skillsService.removeFromAgent(skillId, agentId, user.id);
    return { success: true };
  }

  @Get(':id/runs')
  async getSkillRuns(
    @Param('id') skillId: string,
    @CurrentUser() user: UserEntity,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return await this.skillRunsService.findRunsBySkill(skillId, user.id, {
      skip: skip || 0,
      limit: limit || 10,
      status,
    });
  }

  @Get('runs/:runId')
  async getSkillRun(@Param('runId') runId: string, @CurrentUser() user: UserEntity) {
    return await this.skillRunsService.findOne(runId, user.id);
  }
}
