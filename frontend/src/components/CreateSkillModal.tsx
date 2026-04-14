import React, { useState } from 'react';
import { Skill } from '@/types';

interface CreateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSkill: (skill: Partial<Skill>) => Promise<void>;
}

export const CreateSkillModal: React.FC<CreateSkillModalProps> = ({ isOpen, onClose, onCreateSkill }) => {
  const defaultInputSchema = { type: 'object', properties: {} };
  const defaultOutputSchema = { type: 'object', properties: {} };
  const defaultConfig = {};

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'api_call' as const,
    configStr: JSON.stringify(defaultConfig, null, 2),
    inputSchemaStr: JSON.stringify(defaultInputSchema, null, 2),
    outputSchemaStr: JSON.stringify(defaultOutputSchema, null, 2),
    timeout: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse JSON strings, with fallback to empty objects
      let config = {};
      let inputSchema = {};
      let outputSchema = {};

      try {
        config = JSON.parse(formData.configStr || '{}');
      } catch {
        config = {};
      }

      try {
        inputSchema = JSON.parse(formData.inputSchemaStr);
      } catch {
        setError('Invalid Input Schema JSON');
        setLoading(false);
        return;
      }

      try {
        outputSchema = JSON.parse(formData.outputSchemaStr);
      } catch {
        setError('Invalid Output Schema JSON');
        setLoading(false);
        return;
      }

      const skillData: Partial<Skill> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        config,
        inputSchema,
        outputSchema,
        ...(formData.timeout && { timeout: parseInt(formData.timeout) }),
      };

      await onCreateSkill(skillData);

      setFormData({
        name: '',
        description: '',
        type: 'api_call',
        configStr: JSON.stringify(defaultConfig, null, 2),
        inputSchemaStr: JSON.stringify(defaultInputSchema, null, 2),
        outputSchemaStr: JSON.stringify(defaultOutputSchema, null, 2),
        timeout: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Skill</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter skill name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter skill description"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="api_call">API Call</option>
              <option value="web_search">Web Search</option>
              <option value="document_parse">Document Parse</option>
              <option value="data_transform">Data Transform</option>
              <option value="external_service">External Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Config (JSON)</label>
            <textarea
              value={formData.configStr}
              onChange={(e) => setFormData((prev) => ({ ...prev, configStr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{"method": "GET", "url": "https://api.example.com"}'
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Schema (JSON) *</label>
            <textarea
              value={formData.inputSchemaStr}
              onChange={(e) => setFormData((prev) => ({ ...prev, inputSchemaStr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{"type": "object", "properties": {"query": {"type": "string"}}}'
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Schema (JSON) *</label>
            <textarea
              value={formData.outputSchemaStr}
              onChange={(e) => setFormData((prev) => ({ ...prev, outputSchemaStr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{"type": "object", "properties": {"result": {"type": "string"}}}'
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (ms)</label>
            <input
              type="number"
              value={formData.timeout}
              onChange={(e) => setFormData((prev) => ({ ...prev, timeout: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5000"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Skill'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
