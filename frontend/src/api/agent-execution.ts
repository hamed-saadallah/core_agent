import { apiClient } from './client';
import { ApiResponse } from '@/types';

export interface SkillContextDto {
  skillName: string;
  output: Record<string, any>;
  error?: string;
}

export interface ExecuteWithContextResponse {
  response: string;
  skillsUsed: string[];
  skillDetails: SkillContextDto[];
}

export const agentExecutionApi = {
  async executeWithContextEnrichment(
    agentId: string,
    userMessage: string,
  ): Promise<ExecuteWithContextResponse> {
    const response = await apiClient.post<ApiResponse<ExecuteWithContextResponse>>(
      `/agents/${agentId}/execute-with-context`,
      {
        userMessage,
      },
    );
    return response.data.data;
  },
};
