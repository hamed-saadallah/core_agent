import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '@/config/database.config';
import { UserEntity } from './entities/user.entity';
import { AgentEntity } from './entities/agent.entity';
import { ToolEntity } from './entities/tool.entity';
import { PromptEntity } from './entities/prompt.entity';
import { AgentRunEntity } from './entities/agent-run.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: DatabaseConfigService) => configService.getDatabaseConfig(),
      inject: [DatabaseConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, AgentEntity, ToolEntity, PromptEntity, AgentRunEntity]),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService, TypeOrmModule],
})
export class DatabaseModule {}
