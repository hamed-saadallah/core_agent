import { ToolRegistry } from './tool-registry.service';
export declare class ToolRegistryService {
    private readonly logger;
    private registry;
    constructor();
    private initializeBuiltInTools;
    getRegistry(): ToolRegistry;
    registerTool(name: string, tool: any): void;
    getTool(name: string): any;
    getAllTools(): any[];
    getRegisteredToolNames(): string[];
}
