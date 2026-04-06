import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { CreateModelModal } from '@/components/modals/CreateModelModal';
import { EditModelModal } from '@/components/modals/EditModelModal';
import { modelsApi } from '@/api/models';
import { useAppStore } from '@/store';
import { Model } from '@/types';

export const ModelManagementTab: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { models, setModels, removeModel } = useAppStore();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modelsApi.getAll();
      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await modelsApi.delete(id);
      removeModel(id);
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete model');
    }
  };

  const handleEditClick = (model: Model) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadModels();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedModel(null);
    loadModels();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Manage Models</h3>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus size={18} />
          Add Model
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading models...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No models configured yet</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={18} />
            Create Your First Model
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{model.name}</h4>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <span className="font-medium">Version:</span> {model.version}
                  </span>
                  <span>
                    <span className="font-medium">Temperature:</span> {model.temperature}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      model.status === 'enabled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {model.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEditClick(model)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit model"
                >
                  <FiEdit2 size={18} />
                </button>
                {deleteConfirm === model.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(model.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete model"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditModelModal
        isOpen={isEditModalOpen}
        model={selectedModel}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedModel(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};
