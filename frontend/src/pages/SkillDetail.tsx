import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillsApi } from '@/api/skills';
import { Skill } from '@/types';
import { SkillExecuteModal } from '@/components/SkillExecuteModal';

export const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [editedConfig, setEditedConfig] = useState('');

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const skillData = await skillsApi.getById(id);
        setSkill(skillData);
        setEditedConfig(JSON.stringify(skillData.config, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skill');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleSaveConfig = async () => {
    if (!skill || !id) return;

    try {
      const config = JSON.parse(editedConfig);
      const updated = await skillsApi.update(id, { config });
      setSkill(updated);
      setIsEditingConfig(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
    }
  };

  const getSkillTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      api_call: 'API Call',
      web_search: 'Web Search',
      document_parse: 'Document Parse',
      data_transform: 'Data Transform',
      external_service: 'External Service',
    };
    return labels[type] || type;
  };

  if (loading) return <div className="p-6 text-gray-600">Loading skill...</div>;
  if (!skill) return <div className="p-6 text-red-600">Skill not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/skills')} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Skills
          </button>
          <h1 className="text-3xl font-bold">{skill.name}</h1>
        </div>
        <button
          onClick={() => setIsExecuteModalOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Execute Skill
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700">{skill.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Skill Type</h3>
          <p className="text-gray-700">{getSkillTypeLabel(skill.type)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <p className="text-gray-700">{skill.status}</p>
        </div>
      </div>

      {skill.timeout && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Timeout</h3>
          <p className="text-gray-700">{skill.timeout}ms</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Configuration</h2>
          {!isEditingConfig && (
            <button onClick={() => setIsEditingConfig(true)} className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
          )}
        </div>

        {isEditingConfig ? (
          <div>
            <textarea
              value={editedConfig}
              onChange={(e) => setEditedConfig(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm mb-3"
              rows={10}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveConfig}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingConfig(false);
                  setEditedConfig(JSON.stringify(skill.config, null, 2));
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <pre className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-48">
            {JSON.stringify(skill.config, null, 2)}
          </pre>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Input Schema</h3>
          <pre className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-48">
            {JSON.stringify(skill.inputSchema, null, 2)}
          </pre>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Output Schema</h3>
          <pre className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-48">
            {JSON.stringify(skill.outputSchema, null, 2)}
          </pre>
        </div>
      </div>

      <SkillExecuteModal
        skillId={skill.id}
        isOpen={isExecuteModalOpen}
        onClose={() => setIsExecuteModalOpen(false)}
        inputSchema={skill.inputSchema}
      />
    </div>
  );
};
