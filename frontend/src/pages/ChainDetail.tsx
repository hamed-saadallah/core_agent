import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chainsApi } from '@/api/chains';
import { agentsApi } from '@/api/agents';
import { Chain, ChainNode, Agent } from '@/types';
import { ChainNodeList } from '@/components/ChainNodeList';
import { ExecuteChainModal } from '@/components/ExecuteChainModal';

export const ChainDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chain, setChain] = useState<Chain | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const chainData = await chainsApi.getById(id);
        setChain(chainData);
        setEditedPrompt(chainData.startingPrompt);

        const { agents: agentsList } = await agentsApi.getAll(0, 100);
        setAgents(agentsList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chain');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSavePrompt = async () => {
    if (!chain || !id) return;

    try {
      const updated = await chainsApi.update(id, { startingPrompt: editedPrompt });
      setChain(updated);
      setIsEditingPrompt(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prompt');
    }
  };

  const handleAddNode = async (agentId: string) => {
    if (!chain || !id) return;

    try {
      const order = (chain.nodes?.length || 0);
      const newNode = await chainsApi.addNode(id, {
        agentId,
        order,
        nodeConfig: {},
      } as unknown as Partial<ChainNode>);

      setChain((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: [...(prev.nodes || []), newNode],
        };
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add node');
    }
  };

  const handleRemoveNode = async (nodeId: string) => {
    if (!chain || !id) return;

    try {
      await chainsApi.removeNode(id, nodeId);
      setChain((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: (prev.nodes || []).filter((n) => n.id !== nodeId),
        };
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove node');
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading chain...</div>;
  if (!chain) return <div className="p-6 text-red-600">Chain not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/chains')} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Chains
          </button>
          <h1 className="text-3xl font-bold">{chain.name}</h1>
        </div>
        <button
          onClick={() => setIsExecuteModalOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Execute Chain
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700">{chain.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Starting Prompt</h2>
          {!isEditingPrompt && (
            <button onClick={() => setIsEditingPrompt(true)} className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
          )}
        </div>

        {isEditingPrompt ? (
          <div>
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-3 font-mono text-sm"
              rows={6}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePrompt}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingPrompt(false);
                  setEditedPrompt(chain.startingPrompt);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <pre className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto">{editedPrompt}</pre>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Chain Nodes ({chain.nodes?.length || 0})</h2>

        {(chain.nodes?.length || 0) > 0 ? (
          <ChainNodeList nodes={chain.nodes || []} agents={agents} onRemoveNode={handleRemoveNode} />
        ) : (
          <p className="text-gray-600 mb-4">No nodes added yet</p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Add Node</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAddNode(agent.id)}
                className="text-left p-3 border border-blue-300 rounded hover:bg-blue-50 transition"
              >
                <p className="font-semibold text-sm">{agent.name}</p>
                <p className="text-xs text-gray-600">{agent.description}</p>
              </button>
            ))}
          </div>
          {agents.length === 0 && (
            <p className="text-gray-600">
              No agents available. Please create an agent first.
            </p>
          )}
        </div>
      </div>

      <ExecuteChainModal
        chainId={chain.id}
        isOpen={isExecuteModalOpen}
        onClose={() => setIsExecuteModalOpen(false)}
        startingPrompt={chain.startingPrompt}
      />
    </div>
  );
};
