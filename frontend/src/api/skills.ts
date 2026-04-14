import { apiClient } from './client';
import { Skill, SkillRun, ApiResponse } from '@/types';

export const skillsApi = {
  // Skill CRUD operations
  async getAll(skip = 0, limit = 10, status?: string, type?: string): Promise<{ skills: Skill[]; total: number }> {
    const response = await apiClient.get<ApiResponse<{ skills: Skill[]; total: number }>>('/skills', {
      params: { skip, limit, ...(status && { status }), ...(type && { type }) },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Skill> {
    const response = await apiClient.get<ApiResponse<Skill>>(`/skills/${id}`);
    return response.data.data;
  },

  async create(skill: Partial<Skill>): Promise<Skill> {
    const response = await apiClient.post<ApiResponse<Skill>>('/skills', skill);
    return response.data.data;
  },

  async update(id: string, skill: Partial<Skill>): Promise<Skill> {
    const response = await apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, skill);
    return response.data.data;
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/skills/${id}`);
    return response.data.data;
  },

  // Skill execution
  async executeSkill(
    id: string,
    input: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; output: any; runId: string; executionTime: number }> {
    const response = await apiClient.post<
      ApiResponse<{ success: boolean; output: any; runId: string; executionTime: number }>
    >(`/skills/${id}/execute`, { input, metadata });
    return response.data.data;
  },

  // Agent-skill linking
  async assignToAgent(skillId: string, agentId: string): Promise<Skill> {
    const response = await apiClient.post<ApiResponse<Skill>>(`/skills/${skillId}/agents/${agentId}`);
    return response.data.data;
  },

  async removeFromAgent(skillId: string, agentId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/skills/${skillId}/agents/${agentId}`);
    return response.data.data;
  },

  // Skill runs / execution history
  async getRuns(skillId: string, skip = 0, limit = 10, status?: string): Promise<{ runs: SkillRun[]; total: number }> {
    const response = await apiClient.get<ApiResponse<{ runs: SkillRun[]; total: number }>>(`/skills/${skillId}/runs`, {
      params: { skip, limit, ...(status && { status }) },
    });
    return response.data.data;
  },

  async getRun(runId: string): Promise<SkillRun> {
    const response = await apiClient.get<ApiResponse<SkillRun>>(`/skills/runs/${runId}`);
    return response.data.data;
  },
};
