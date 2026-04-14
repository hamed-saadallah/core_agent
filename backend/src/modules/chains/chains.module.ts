import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEntity } from '@/infrastructure/database/entities/chain.entity';
import { ChainNodeEntity } from '@/infrastructure/database/entities/chain-node.entity';
import { ChainRunEntity } from '@/infrastructure/database/entities/chain-run.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { ChainsService } from './services/chains.service';
import { ChainNodesService } from './services/chain-nodes.service';
import { ChainRunsService } from './services/chain-runs.service';
import { ChainsController } from './controllers/chains.controller';
import { AgentRunsModule } from '@/modules/agent-runs/agent-runs.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChainEntity, ChainNodeEntity, ChainRunEntity, AgentEntity]), AgentRunsModule],
  providers: [ChainsService, ChainNodesService, ChainRunsService],
  controllers: [ChainsController],
  exports: [ChainsService, ChainNodesService, ChainRunsService],
})
export class ChainsModule {}
