import { apiClient } from './client';
import { Model, ApiResponse } from '../types';

export const modelsApi = {
  async getAll(): Promise<Model[]> {
    const response = await apiClient.get<ApiResponse<Model[]>>('/models');
    return response.data.data;
  },

  async getOne(id: string): Promise<Model> {
    const response = await apiClient.get<ApiResponse<Model>>(`/models/${id}`);
    return response.data.data;
  },

  async create(model: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>): Promise<Model> {
    const response = await apiClient.post<ApiResponse<Model>>('/models', model);
    return response.data.data;
  },

  async update(id: string, model: Partial<Omit<Model, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Model> {
    const response = await apiClient.put<ApiResponse<Model>>(`/models/${id}`, model);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/models/${id}`);
  },
};
