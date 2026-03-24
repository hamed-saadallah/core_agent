import { apiClient } from './client';
import { Tool, ApiResponse } from '@/types';

export const toolsApi = {
  getAll: (skip = 0, limit = 10) => apiClient.get<ApiResponse<{ tools: Tool[]; total: number }>>('/tools', {
    params: { skip, limit },
  }),

  getById: (id: string) => apiClient.get<ApiResponse<Tool>>(`/tools/${id}`),

  getActive: () => apiClient.get<ApiResponse<Tool[]>>('/tools/active/list'),

  create: (tool: Partial<Tool>) => apiClient.post<ApiResponse<Tool>>('/tools', tool),

  update: (id: string, tool: Partial<Tool>) => apiClient.put<ApiResponse<Tool>>(`/tools/${id}`, tool),

  delete: (id: string) => apiClient.delete<ApiResponse<{ success: boolean }>>(`/tools/${id}`),
};
