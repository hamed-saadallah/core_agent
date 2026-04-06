import { apiClient } from './client';
import { AgentRun, ApiResponse } from '@/types';

export const agentRunsApi = {
  async getAll(agentId?: string, status?: string, skip = 0, limit = 10) {
    const response = await apiClient.get<ApiResponse<{ runs: AgentRun[]; total: number }>>('/agent-runs', {
      params: { agentId, status, skip, limit },
    });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<AgentRun>>(`/agent-runs/${id}`);
    return response.data.data;
  },

  async getByAgentId(agentId: string, skip = 0, limit = 10) {
    const response = await apiClient.get<ApiResponse<{ runs: AgentRun[]; total: number }>>(`/agent-runs/agent/${agentId}`, {
      params: { skip, limit },
    });
    return response.data.data;
  },

  async create(run: Partial<AgentRun>) {
    const response = await apiClient.post<ApiResponse<AgentRun>>('/agent-runs', run);
    return response.data.data;
  },
};
