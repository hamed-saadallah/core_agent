import { apiClient } from './client';
import { Agent, ApiResponse } from '@/types';

export const agentsApi = {
  async getAll(skip = 0, limit = 10): Promise<{ agents: Agent[]; total: number }> {
    const response = await apiClient.get<ApiResponse<{ agents: Agent[]; total: number }>>('/agents', {
      params: { skip, limit },
    });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Agent>>(`/agents/${id}`);
    return response.data.data;
  },

  async create(agent: Partial<Agent>) {
    const response = await apiClient.post<ApiResponse<Agent>>('/agents', agent);
    return response.data.data;
  },

  async update(id: string, agent: Partial<Agent>) {
    const response = await apiClient.put<ApiResponse<Agent>>(`/agents/${id}`, agent);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/agents/${id}`);
    return response.data.data;
  },

  async execute(id: string, parameters: Record<string, string>, metadata?: Record<string, any>) {
    const response = await apiClient.post<ApiResponse<{ success: boolean; output: any; executionTime: number; runId: string }>>(
      `/agents/${id}/execute`,
      { parameters, metadata },
    );
    return response.data.data;
  },
};
