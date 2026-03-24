import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistry } from './tool-registry.service';
import { calculateTool, getCurrentTimeTool, reverseStringTool, countCharactersTool } from './built-in.tools';

@Injectable()
export class ToolRegistryService {
  private readonly logger = new Logger(ToolRegistryService.name);
  private registry: ToolRegistry;

  constructor() {
    this.registry = new ToolRegistry();
    this.initializeBuiltInTools();
  }

  private initializeBuiltInTools(): void {
    this.logger.log('Initializing built-in tools...');
    this.registry.registerTool('calculator', calculateTool);
    this.registry.registerTool('get-current-time', getCurrentTimeTool);
    this.registry.registerTool('reverse-string', reverseStringTool);
    this.registry.registerTool('count-characters', countCharactersTool);
    this.logger.log(`Built-in tools initialized: ${this.registry.getRegisteredToolNames().join(', ')}`);
  }

  getRegistry(): ToolRegistry {
    return this.registry;
  }

  registerTool(name: string, tool: any): void {
    this.registry.registerTool(name, tool);
  }

  getTool(name: string): any {
    return this.registry.getTool(name);
  }

  getAllTools(): any[] {
    return this.registry.getAllTools();
  }

  getRegisteredToolNames(): string[] {
    return this.registry.getRegisteredToolNames();
  }
}
