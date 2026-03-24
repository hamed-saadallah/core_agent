import { apiClient } from './client';
import { AgentRun, ApiResponse } from '@/types';

export const agentRunsApi = {
  getAll: (agentId?: string, status?: string, skip = 0, limit = 10) =>
    apiClient.get<ApiResponse<{ runs: AgentRun[]; total: number }>>('/agent-runs', {
      params: { agentId, status, skip, limit },
    }),

  getById: (id: string) => apiClient.get<ApiResponse<AgentRun>>(`/agent-runs/${id}`),

  getByAgentId: (agentId: string, skip = 0, limit = 10) =>
    apiClient.get<ApiResponse<{ runs: AgentRun[]; total: number }>>(`/agent-runs/agent/${agentId}`, {
      params: { skip, limit },
    }),

  create: (run: Partial<AgentRun>) => apiClient.post<ApiResponse<AgentRun>>('/agent-runs', run),
};
