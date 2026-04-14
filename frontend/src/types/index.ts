export interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  modelId: string;
  model?: Model;
  temperature?: number;
  config?: Record<string, any>;
  tools: Tool[];
  skills?: Skill[];
  prompt?: Prompt;
  promptTemplate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  apiKey?: string | null;
  status: 'enabled' | 'disabled';
  temperature: number;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  schema: Record<string, any>;
  category?: string;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  name: string;
  systemPrompt: string;
  userPrompt?: string;
  examples?: Array<{ input: string; output: string }>;
  version?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  userId: string;
  input: any;
  output?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ChainNode {
  id: string;
  chainId: string;
  agentId: string;
  agent?: Agent;
  order: number;
  nodeConfig?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Chain {
  id: string;
  name: string;
  description: string;
  status: string;
  startingPrompt: string;
  config?: Record<string, any>;
  ownerId?: string;
  nodes?: ChainNode[];
  createdAt: string;
  updatedAt: string;
}

export interface IntermediateResult {
  nodeId: string;
  nodeOrder: number;
  agentId: string;
  agentRunId?: string;
  output?: any;
  error?: string;
  executionTime: number;
  status: 'completed' | 'failed';
}

export interface ChainRun {
  id: string;
  chainId: string;
  userId: string;
  input: any;
  output?: any;
  intermediateResults: IntermediateResult[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'api_call' | 'web_search' | 'document_parse' | 'data_transform' | 'external_service';
  config: Record<string, any>;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  status: string;
  ownerId?: string;
  retryConfig?: {
    maxRetries: number;
    backoffMs: number;
    retryOn: string[];
  };
  timeout?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillRun {
  id: string;
  skillId: string;
  agentRunId?: string;
  userId: string;
  input: any;
  output?: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retried';
  error?: string;
  executionTime: number;
  retryCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
