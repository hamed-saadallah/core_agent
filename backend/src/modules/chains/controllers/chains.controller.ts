import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { UserEntity } from '@/infrastructure/database/entities/user.entity';
import { ChainsService } from '../services/chains.service';
import { ChainNodesService } from '../services/chain-nodes.service';
import { ChainRunsService } from '../services/chain-runs.service';
import { CreateChainDto, UpdateChainDto, AddChainNodeDto, UpdateChainNodeDto, ExecuteChainDto, QueryChainsDto, QueryChainRunsDto } from '../dtos/chain.dto';

@Controller('chains')
@UseGuards(AuthGuard('jwt'))
@UseFilters(AllExceptionsFilter)
export class ChainsController {
  constructor(
    private chainsService: ChainsService,
    private chainNodesService: ChainNodesService,
    private chainRunsService: ChainRunsService,
  ) {}

  @Get()
  async getChains(
    @CurrentUser() user: UserEntity,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return await this.chainsService.findAll(user.id, {
      skip: skip || 0,
      limit: limit || 10,
      status,
    });
  }

  @Post()
  async createChain(@Body() createChainDto: CreateChainDto, @CurrentUser() user: UserEntity) {
    return await this.chainsService.create(createChainDto, user.id);
  }

  @Get(':id')
  async getChain(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.chainsService.findOne(id, user.id);
  }

  @Put(':id')
  async updateChain(@Param('id') id: string, @Body() updateChainDto: UpdateChainDto, @CurrentUser() user: UserEntity) {
    return await this.chainsService.update(id, updateChainDto, user.id);
  }

  @Delete(':id')
  async deleteChain(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    await this.chainsService.delete(id, user.id);
    return { success: true };
  }

  @Post(':id/nodes')
  async addNode(@Param('id') chainId: string, @Body() addNodeDto: AddChainNodeDto, @CurrentUser() user: UserEntity) {
    return await this.chainNodesService.addNode(chainId, addNodeDto, user.id);
  }

  @Put(':id/nodes/:nodeId')
  async updateNode(
    @Param('id') chainId: string,
    @Param('nodeId') nodeId: string,
    @Body() updateNodeDto: UpdateChainNodeDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.chainNodesService.updateNode(chainId, nodeId, updateNodeDto, user.id);
  }

  @Delete(':id/nodes/:nodeId')
  async removeNode(@Param('id') chainId: string, @Param('nodeId') nodeId: string, @CurrentUser() user: UserEntity) {
    await this.chainNodesService.removeNode(chainId, nodeId, user.id);
    return { success: true };
  }

  @Post(':id/execute')
  async executeChain(@Param('id') id: string, @Body() executeChainDto: ExecuteChainDto, @CurrentUser() user: UserEntity) {
    return await this.chainRunsService.executeChainRun(id, user.id, executeChainDto.parameters, executeChainDto.metadata);
  }

  @Get(':id/runs')
  async getChainRuns(
    @Param('id') chainId: string,
    @CurrentUser() user: UserEntity,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return await this.chainRunsService.getRunsByChain(chainId, skip || 0, limit || 10, user.id, status);
  }

  @Get('runs/:runId')
  async getChainRun(@Param('runId') runId: string, @CurrentUser() user: UserEntity) {
    return await this.chainRunsService.findOne(runId, user.id);
  }
}
