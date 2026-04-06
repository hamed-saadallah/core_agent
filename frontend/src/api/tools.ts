import { apiClient } from './client';
import { Tool, ApiResponse } from '@/types';

export const toolsApi = {
  async getAll(skip = 0, limit = 10) {
    const response = await apiClient.get<ApiResponse<{ tools: Tool[]; total: number }>>('/tools', {
      params: { skip, limit },
    });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Tool>>(`/tools/${id}`);
    return response.data.data;
  },

  async getActive() {
    const response = await apiClient.get<ApiResponse<Tool[]>>('/tools/active/list');
    return response.data.data;
  },

  async create(tool: Partial<Tool>) {
    const response = await apiClient.post<ApiResponse<Tool>>('/tools', tool);
    return response.data.data;
  },

  async update(id: string, tool: Partial<Tool>) {
    const response = await apiClient.put<ApiResponse<Tool>>(`/tools/${id}`, tool);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/tools/${id}`);
    return response.data.data;
  },
};
