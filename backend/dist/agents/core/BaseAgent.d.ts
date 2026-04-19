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
export declare abstract class BaseAgent {
    protected logger: Logger;
    protected config: BaseAgentConfig;
    protected executor: AgentExecutor | null;
    constructor(config: BaseAgentConfig);
    getName(): string;
    getDescription(): string;
    getTools(): BaseTool[];
    getConfig(): BaseAgentConfig;
    abstract initialize(): Promise<void>;
    abstract execute(input: any): Promise<AgentExecutionResult>;
    protected measureExecutionTime<T>(fn: () => Promise<T>): Promise<{
        result: T;
        duration: number;
    }>;
    protected logExecution(result: AgentExecutionResult): void;
    cleanup(): Promise<void>;
}
