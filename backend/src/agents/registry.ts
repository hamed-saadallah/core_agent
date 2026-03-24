import { Injectable, Logger } from '@nestjs/common';
import { BaseAgent } from './core/BaseAgent';

@Injectable()
export class AgentRegistry {
  private readonly logger = new Logger(AgentRegistry.name);
  private agents: Map<string, BaseAgent> = new Map();

  registerAgent(agent: BaseAgent): void {
    const name = agent.getName();
    if (this.agents.has(name)) {
      this.logger.warn(`Agent "${name}" is already registered. Overwriting...`);
    }
    this.agents.set(name, agent);
    this.logger.debug(`Agent "${name}" registered successfully`);
  }

  getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  hasAgent(name: string): boolean {
    return this.agents.has(name);
  }

  unregisterAgent(name: string): boolean {
    const deleted = this.agents.delete(name);
    if (deleted) {
      this.logger.debug(`Agent "${name}" unregistered successfully`);
    }
    return deleted;
  }

  getRegisteredAgentNames(): string[] {
    return Array.from(this.agents.keys());
  }

  getAgentsByNames(names: string[]): BaseAgent[] {
    return names.map((name) => this.getAgent(name)).filter((agent) => agent !== undefined) as BaseAgent[];
  }

  clearAllAgents(): void {
    this.agents.clear();
    this.logger.debug('All agents cleared');
  }
}
