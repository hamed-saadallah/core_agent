import { BaseAgent } from './core/BaseAgent';
export declare class AgentRegistry {
    private readonly logger;
    private agents;
    registerAgent(agent: BaseAgent): void;
    getAgent(name: string): BaseAgent | undefined;
    getAllAgents(): BaseAgent[];
    hasAgent(name: string): boolean;
    unregisterAgent(name: string): boolean;
    getRegisteredAgentNames(): string[];
    getAgentsByNames(names: string[]): BaseAgent[];
    clearAllAgents(): void;
}
