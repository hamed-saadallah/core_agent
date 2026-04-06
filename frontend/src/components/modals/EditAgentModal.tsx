import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { agentsApi } from '@/api/agents';
import { modelsApi } from '@/api/models';
import { useAppStore } from '@/store';
import { Agent, Model } from '@/types';

interface EditAgentModalProps {
  isOpen: boolean;
  agent: Agent | null;
  onClose: () => void;
  onSuccess: (agent: Agent) => void;
}

export const EditAgentModal: React.FC<EditAgentModalProps> = ({
  isOpen,
  agent,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    modelId: '',
    promptTemplate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const { updateAgent } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      const fetchModels = async () => {
        try {
          const response = await modelsApi.getAll();
          setModels(response);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch models');
        }
      };
      fetchModels();
    }
  }, [isOpen]);

  useEffect(() => {
    if (agent && isOpen) {
      setFormData({
        name: agent.name,
        description: agent.description,
        modelId: agent.modelId || '',
        promptTemplate: agent.promptTemplate || '',
      });
      setError(null);
    }
  }, [agent, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const extractParameters = (template: string): string[] => {
    const matches = template.match(/{(\w+)}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.slice(1, -1)))];
  };

  const detectedParams = extractParameters(formData.promptTemplate);
  const enabledModels = models.filter((m) => m.status === 'enabled');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Agent name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Agent description is required');
      }
      if (!formData.modelId) {
        throw new Error('Model selection is required');
      }

      const response = await agentsApi.update(agent.id, formData);
      const updatedAgent = response.data.data;

      updateAgent(updatedAgent);
      onSuccess(updatedAgent);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !agent) return null;

  const currentModel = models.find((m) => m.id === agent.modelId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Edit Agent</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {currentModel && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900 mb-1">Current Model:</p>
              <p className="text-sm text-blue-800">{currentModel.name} (v{currentModel.version})</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="What does this agent do?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <select
              name="modelId"
              value={formData.modelId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a model...</option>
              {enabledModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} (v{model.version})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Only enabled models are shown</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Template
            </label>
            <textarea
              name="promptTemplate"
              value={formData.promptTemplate}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., Summarize this content {content}"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use curly braces to define parameters: {'{'}paramName{'}'}
            </p>
            {detectedParams.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs font-medium text-blue-900 mb-1">Detected parameters:</p>
                <div className="flex flex-wrap gap-1">
                  {detectedParams.map((param) => (
                    <span
                      key={param}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
