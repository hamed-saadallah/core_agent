import { apiClient } from './client';
import { Agent, ApiResponse } from '@/types';

export const agentsApi = {
  getAll: (skip = 0, limit = 10) => apiClient.get<ApiResponse<{ agents: Agent[]; total: number }>>('/agents', {
    params: { skip, limit },
  }),

  getById: (id: string) => apiClient.get<ApiResponse<Agent>>(`/agents/${id}`),

  create: (agent: Partial<Agent>) => apiClient.post<ApiResponse<Agent>>('/agents', agent),

  update: (id: string, agent: Partial<Agent>) => apiClient.put<ApiResponse<Agent>>(`/agents/${id}`, agent),

  delete: (id: string) => apiClient.delete<ApiResponse<{ success: boolean }>>(`/agents/${id}`),

  execute: (id: string, parameters: Record<string, string>, metadata?: Record<string, any>) =>
    apiClient.post<ApiResponse<{ success: boolean; output: any; executionTime: number; runId: string }>>(
      `/agents/${id}/execute`,
      { parameters, metadata },
    ),
};
