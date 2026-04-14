import { apiClient } from './client';
import { Chain, ChainNode, ChainRun, ApiResponse } from '@/types';

export const chainsApi = {
  // Chain CRUD operations
  async getAll(skip = 0, limit = 10, status?: string): Promise<{ chains: Chain[]; total: number }> {
    const response = await apiClient.get<ApiResponse<{ chains: Chain[]; total: number }>>('/chains', {
      params: { skip, limit, ...(status && { status }) },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Chain> {
    const response = await apiClient.get<ApiResponse<Chain>>(`/chains/${id}`);
    return response.data.data;
  },

  async create(chain: Partial<Chain>): Promise<Chain> {
    const response = await apiClient.post<ApiResponse<Chain>>('/chains', chain);
    return response.data.data;
  },

  async update(id: string, chain: Partial<Chain>): Promise<Chain> {
    const response = await apiClient.put<ApiResponse<Chain>>(`/chains/${id}`, chain);
    return response.data.data;
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/chains/${id}`);
    return response.data.data;
  },

  // Chain nodes operations
  async addNode(chainId: string, node: Partial<ChainNode>): Promise<ChainNode> {
    const response = await apiClient.post<ApiResponse<ChainNode>>(`/chains/${chainId}/nodes`, node);
    return response.data.data;
  },

  async updateNode(chainId: string, nodeId: string, node: Partial<ChainNode>): Promise<ChainNode> {
    const response = await apiClient.put<ApiResponse<ChainNode>>(`/chains/${chainId}/nodes/${nodeId}`, node);
    return response.data.data;
  },

  async removeNode(chainId: string, nodeId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/chains/${chainId}/nodes/${nodeId}`);
    return response.data.data;
  },

  // Chain execution
  async execute(
    id: string,
    parameters: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; output: any; executionTime: number; runId: string; intermediateResults: any[] }> {
    const response = await apiClient.post<
      ApiResponse<{ success: boolean; output: any; executionTime: number; runId: string; intermediateResults: any[] }>
    >(`/chains/${id}/execute`, { parameters, metadata });
    return response.data.data;
  },

  // Chain runs
  async getRuns(
    chainId: string,
    skip = 0,
    limit = 10,
    status?: string,
  ): Promise<{ runs: ChainRun[]; total: number }> {
    const response = await apiClient.get<ApiResponse<{ runs: ChainRun[]; total: number }>>(`/chains/${chainId}/runs`, {
      params: { skip, limit, ...(status && { status }) },
    });
    return response.data.data;
  },

  async getRun(runId: string): Promise<ChainRun> {
    const response = await apiClient.get<ApiResponse<ChainRun>>(`/chains/runs/${runId}`);
    return response.data.data;
  },
};
