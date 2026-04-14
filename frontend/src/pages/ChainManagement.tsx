import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chainsApi } from '@/api/chains';
import { Chain } from '@/types';
import { CreateChainModal } from '@/components/CreateChainModal';

export const ChainManagement: React.FC = () => {
  const navigate = useNavigate();
  const [localChains, setLocalChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      setError(null);
      try {
        const { chains } = await chainsApi.getAll();
        setLocalChains(chains);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chains');
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  const handleViewChainDetails = (chain: Chain) => {
    navigate(`/chains/${chain.id}`);
  };

  const handleDeleteChain = async (chainId: string) => {
    if (!window.confirm('Are you sure you want to delete this chain?')) {
      return;
    }

    try {
      await chainsApi.delete(chainId);
      setLocalChains((prev) => prev.filter((c) => c.id !== chainId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chain');
    }
  };

  const handleCreateChain = async (chain: Partial<Chain>) => {
    try {
      const newChain = await chainsApi.create(chain);
      setLocalChains((prev) => [newChain, ...prev]);
      setIsCreateModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chain');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chains</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Chain
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading chains...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localChains.map((chain) => (
          <div key={chain.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div onClick={() => handleViewChainDetails(chain)} className="cursor-pointer mb-4">
              <h3 className="text-lg font-semibold mb-2">{chain.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{chain.description}</p>
              <div className="mb-2 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-xs font-medium text-green-900">Nodes: {chain.nodes?.length || 0}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleViewChainDetails(chain)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteChain(chain.id)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {localChains.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No chains yet</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create your first chain
          </button>
        </div>
      )}

      <CreateChainModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateChain={handleCreateChain} />
    </div>
  );
};
