import { Logger } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';

export interface BaseTool {
  name: string;
  description: string;
  func: (input: any) => Promise<string>;
}

export interface BaseAgentConfig {
  name: string;
  description?: string;
  configPath: string;
  tools: BaseTool[];
  model?: string;
  temperature?: number;
}

export interface AgentExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  executionTime: number;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent {
  protected logger: Logger;
  protected config: BaseAgentConfig;
  protected executor: AgentExecutor | null = null;

  constructor(config: BaseAgentConfig) {
    this.config = config;
    this.logger = new Logger(config.name);
  }

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description || '';
  }

  getTools(): BaseTool[] {
    return this.config.tools;
  }

  getConfig(): BaseAgentConfig {
    return this.config;
  }

  abstract initialize(): Promise<void>;

  abstract execute(input: any): Promise<AgentExecutionResult>;

  protected async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    return { result, duration };
  }

  protected logExecution(result: AgentExecutionResult): void {
    if (result.success) {
      this.logger.debug(`Execution completed in ${result.executionTime}ms`);
    } else {
      this.logger.error(`Execution failed: ${result.error}`, result.error);
    }
  }

  async cleanup(): Promise<void> {
    this.logger.debug('Cleaning up agent resources');
  }
}
