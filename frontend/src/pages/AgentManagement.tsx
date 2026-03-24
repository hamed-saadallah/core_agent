import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { agentsApi } from '@/api/agents';
import { Agent } from '@/types';

export const AgentManagement: React.FC = () => {
  const { agents, setAgents, loading, setLoading, error, setError } = useAppStore();
  const [localAgents, setLocalAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await agentsApi.getAll();
        setLocalAgents(response.data.data.agents);
        setAgents(response.data.data.agents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
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
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {agent.status}
              </span>
              <div className="space-x-2">
                <button className="text-primary-600 hover:text-primary-700 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
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
    </div>
  );
};
