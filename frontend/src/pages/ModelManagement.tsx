import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store';
import { modelsApi } from '@/api/models';
import { Model } from '@/types';
import { CreateModelModal } from '@/components/modals/CreateModelModal';
import { EditModelModal } from '@/components/modals/EditModelModal';

export const ModelManagement: React.FC = () => {
  const { setModels } = useAppStore(useShallow((s) => ({ setModels: s.setModels })));
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await modelsApi.getAll();
        setLocalModels(response);
        setModels(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [setModels]);

  const handleEditModel = (model: Model) => {
    setEditingModel(model);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (model: Model) => {
    try {
      const newStatus = model.status === 'enabled' ? 'disabled' : 'enabled';
      const updated = await modelsApi.update(model.id, { status: newStatus } as any);
      
      const updatedList = localModels.map((m) => (m.id === model.id ? updated : m));
      setLocalModels(updatedList);
      setModels(updatedList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update model status');
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!window.confirm('Are you sure you want to delete this model?')) {
      return;
    }

    try {
      await modelsApi.delete(modelId);
      const updatedList = localModels.filter((m) => m.id !== modelId);
      setLocalModels(updatedList);
      setModels(updatedList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete model');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">Models</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-sm sm:text-base"
        >
          Create Model
        </button>
      </div>

      {loading && <p className="text-gray-600 text-sm sm:text-base">Loading models...</p>}
      {error && <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>}

      {/* Mobile Card View (below sm) */}
      <div className="sm:hidden space-y-3">
        {localModels.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-1">{model.name}</h3>
              <div className="text-xs space-y-1 text-gray-600">
                <p><span className="font-medium">Version:</span> {model.version}</p>
                <p><span className="font-medium">Temperature:</span> {model.temperature.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${model.status === 'enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {model.status}
              </span>
            </div>
            <div className="flex gap-2 border-t pt-2">
              <button
                onClick={() => handleToggleStatus(model)}
                className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition ${
                  model.status === 'enabled'
                    ? 'text-yellow-600 hover:bg-yellow-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                title={model.status === 'enabled' ? 'Disable' : 'Enable'}
              >
                {model.status === 'enabled' ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
              </button>
              <button
                onClick={() => handleEditModel(model)}
                className="flex-1 text-blue-600 hover:text-blue-700 text-xs hover:bg-blue-50 px-2 py-1.5 rounded transition inline-flex items-center justify-center"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={() => handleDeleteModel(model.id)}
                className="flex-1 text-red-600 hover:text-red-700 text-xs hover:bg-red-50 px-2 py-1.5 rounded transition inline-flex items-center justify-center"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (sm and up) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Version</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Temperature</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localModels.map((model) => (
              <tr key={model.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium">{model.name}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">{model.version}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">{model.temperature.toFixed(2)}</td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${model.status === 'enabled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {model.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(model)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded transition ${
                        model.status === 'enabled'
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={model.status === 'enabled' ? 'Disable' : 'Enable'}
                    >
                      {model.status === 'enabled' ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                    </button>
                    <button
                      onClick={() => handleEditModel(model)}
                      className="text-blue-600 hover:text-blue-700 text-sm hover:bg-blue-50 px-2 py-1 rounded transition"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="text-red-600 hover:text-red-700 text-sm hover:bg-red-50 px-2 py-1 rounded transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {localModels.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm sm:text-base">No models found. Create one to get started.</p>
        </div>
      )}

      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newModel) => {
          setLocalModels([...localModels, newModel]);
          setModels([...localModels, newModel]);
        }}
      />

      <EditModelModal
        isOpen={isEditModalOpen}
        model={editingModel}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingModel(null);
        }}
        onSuccess={(updatedModel) => {
          const updated = localModels.map((m) => (m.id === updatedModel.id ? updatedModel : m));
          setLocalModels(updated);
          setModels(updated);
        }}
      />
    </div>
  );
};
