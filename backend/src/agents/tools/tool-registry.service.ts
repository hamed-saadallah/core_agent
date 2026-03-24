import { Injectable, Logger } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';

export interface BaseTool {
  name: string;
  description: string;
  func: (input: any) => Promise<string>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  schema?: Record<string, any>;
}

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private tools: Map<string, BaseTool> = new Map();

  registerTool(name: string, tool: BaseTool): void {
    if (this.tools.has(name)) {
      this.logger.warn(`Tool "${name}" is already registered. Overwriting...`);
    }
    this.tools.set(name, tool);
    this.logger.debug(`Tool "${name}" registered successfully`);
  }

  getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  getToolsByNames(names: string[]): BaseTool[] {
    return names.map((name) => this.getTool(name)).filter((tool) => tool !== undefined) as BaseTool[];
  }

  hasToolFunction(name: string): boolean {
    return this.tools.has(name);
  }

  unregisterTool(name: string): boolean {
    const deleted = this.tools.delete(name);
    if (deleted) {
      this.logger.debug(`Tool "${name}" unregistered successfully`);
    }
    return deleted;
  }

  getRegisteredToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  clearAllTools(): void {
    this.tools.clear();
    this.logger.debug('All tools cleared');
  }
}
