import React from 'react';
import { Agent } from '@/types';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  isLoading: boolean;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  isLoading,
}) => {
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select an Agent</h2>
      <select
        value={selectedAgentId || ''}
        onChange={(e) => onSelectAgent(e.target.value)}
        disabled={isLoading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option value="">-- Choose an agent --</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      {selectedAgent && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">{selectedAgent.name}</h3>
          {selectedAgent.description && (
            <p className="text-sm text-gray-600 mb-3">{selectedAgent.description}</p>
          )}
          {selectedAgent.model && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Model:</span> {selectedAgent.model.name} (v{selectedAgent.model.version})
            </p>
          )}
          {selectedAgent.temperature !== undefined && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Temperature:</span> {selectedAgent.temperature.toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
