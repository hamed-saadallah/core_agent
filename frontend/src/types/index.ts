export interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  model: string;
  temperature: number;
  config?: Record<string, any>;
  tools: Tool[];
  prompt?: Prompt;
  createdAt: string;
  updatedAt: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
