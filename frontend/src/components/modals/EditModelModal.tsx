import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { modelsApi } from '@/api/models';
import { useAppStore } from '@/store';
import { Model } from '@/types';

interface EditModelModalProps {
  isOpen: boolean;
  model: Model | null;
  onClose: () => void;
  onSuccess: (model: Model) => void;
}

export const EditModelModal: React.FC<EditModelModalProps> = ({
  isOpen,
  model,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    apiKey: '',
    temperature: 0.7,
    status: 'enabled' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const { updateModel } = useAppStore();

  useEffect(() => {
    if (model && isOpen) {
      setFormData({
        name: model.name,
        version: model.version,
        apiKey: '',
        temperature: typeof model.temperature === 'number' ? model.temperature : parseFloat(model.temperature as any) || 0.7,
        status: model.status as any,
      });
      setError(null);
      setShowApiKey(false);
    }
  }, [model, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'temperature' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;

    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Model name is required');
      }
      if (!formData.version.trim()) {
        throw new Error('Model version is required');
      }

      const updateData: any = {
        name: formData.name,
        version: formData.version,
        temperature: formData.temperature,
        status: formData.status,
      };

      if (formData.apiKey.trim()) {
        updateData.apiKey = formData.apiKey;
      }

      const response = await modelsApi.update(model.id, updateData);
      const updatedModel = response;

      updateModel(updatedModel);
      onSuccess(updatedModel);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update model');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Edit Model</h2>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name *
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
              Model Version *
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key {formData.apiKey === '' ? '(leave blank to keep current)' : ''}
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                disabled={loading}
                placeholder="Leave blank to keep current key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {formData.apiKey && (
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                disabled={loading}
                min="0"
                max="2"
                step="0.1"
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {formData.temperature.toFixed(1)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
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
              {loading ? 'Updating...' : 'Update Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
