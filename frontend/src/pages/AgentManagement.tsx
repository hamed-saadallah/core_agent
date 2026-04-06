import React, { useEffect, useState } from 'react';
import { FiPlay } from 'react-icons/fi';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store';
import { agentsApi } from '@/api/agents';
import { Agent } from '@/types';
import { CreateAgentModal } from '@/components/modals/CreateAgentModal';
import { ExecuteAgentModal } from '@/components/modals/ExecuteAgentModal';
import { EditAgentModal } from '@/components/modals/EditAgentModal';

export const AgentManagement: React.FC = () => {
  const { setAgents, removeAgent } = useAppStore(
    useShallow((s) => ({
      setAgents: s.setAgents,
      removeAgent: s.removeAgent,
    }))
  );
  const [localAgents, setLocalAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { agents } = await agentsApi.getAll();
        setLocalAgents(agents);
        setAgents(agents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [setAgents]);

  const handleRunAgent = (agent: Agent) => {
    if (!agent.promptTemplate) {
      setError('This agent does not have a prompt template configured');
      return;
    }
    setSelectedAgent(agent);
    setIsExecuteModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await agentsApi.delete(agentId);
      setLocalAgents((prev) => prev.filter((a) => a.id !== agentId));
      removeAgent(agentId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Agent
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading agents...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
            {agent.model && (
              <div className="mb-4 p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs font-medium text-purple-900 mb-1">Model:</p>
                <p className="text-sm text-purple-800 font-semibold">{agent.model.name} (v{agent.model.version})</p>
                <p className="text-xs text-purple-700">Temperature: {agent.model.temperature.toFixed(2)}</p>
              </div>
            )}
            {agent.promptTemplate && (
              <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs font-medium text-blue-900 mb-1">Prompt Template:</p>
                <p className="text-xs text-blue-800 font-mono truncate">
                  {agent.promptTemplate}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {agent.status}
              </span>
              <div className="space-x-2">
                {agent.promptTemplate && (
                  <button
                    onClick={() => handleRunAgent(agent)}
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm hover:bg-green-50 px-2 py-1 rounded transition"
                  >
                    <FiPlay size={14} />
                    Run
                  </button>
                )}
                <button
                  onClick={() => handleEditAgent(agent)}
                  className="text-blue-600 hover:text-blue-700 text-sm hover:bg-blue-50 px-2 py-1 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="text-red-600 hover:text-red-700 text-sm hover:bg-red-50 px-2 py-1 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {localAgents.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No agents found. Create one to get started.</p>
        </div>
      )}

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newAgent) => {
          setLocalAgents((prev) => [...prev, newAgent]);
        }}
      />

      <EditAgentModal
        isOpen={isEditModalOpen}
        agent={editingAgent}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAgent(null);
        }}
        onSuccess={(updatedAgent) => {
          setLocalAgents((prev) => prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)));
        }}
      />

      <ExecuteAgentModal
        isOpen={isExecuteModalOpen}
        agent={selectedAgent}
        onClose={() => {
          setIsExecuteModalOpen(false);
          setSelectedAgent(null);
        }}
      />
    </div>
  );
};
