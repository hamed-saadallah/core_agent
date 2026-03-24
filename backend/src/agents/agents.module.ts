import { Module } from '@nestjs/common';
import { ToolRegistryService } from './tools/registry.service';
import { AgentRegistry } from './registry';

@Module({
  providers: [ToolRegistryService, AgentRegistry],
  exports: [ToolRegistryService, AgentRegistry],
})
export class AgentsModule {}
