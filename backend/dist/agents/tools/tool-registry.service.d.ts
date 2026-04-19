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
export declare class ToolRegistry {
    private readonly logger;
    private tools;
    registerTool(name: string, tool: BaseTool): void;
    getTool(name: string): BaseTool | undefined;
    getAllTools(): BaseTool[];
    getToolsByNames(names: string[]): BaseTool[];
    hasToolFunction(name: string): boolean;
    unregisterTool(name: string): boolean;
    getRegisteredToolNames(): string[];
    clearAllTools(): void;
}
