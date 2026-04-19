import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillsApi } from '@/api/skills';
import { Skill } from '@/types';
import { CreateSkillModal } from '@/components/CreateSkillModal';

export const SkillManagement: React.FC = () => {
  const navigate = useNavigate();
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const { skills } = await skillsApi.getAll();
        setLocalSkills(skills);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleViewSkillDetails = (skill: Skill) => {
    navigate(`/skills/${skill.id}`);
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await skillsApi.delete(skillId);
      setLocalSkills((prev) => prev.filter((s) => s.id !== skillId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
    }
  };

  const handleCreateSkill = async (skill: Partial<Skill>) => {
    try {
      const newSkill = await skillsApi.create(skill);
      setLocalSkills((prev) => [newSkill, ...prev]);
      setIsCreateModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create skill');
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

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">Skills</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-sm sm:text-base"
        >
          Create Skill
        </button>
      </div>

      {loading && <p className="text-gray-600 text-sm sm:text-base">Loading skills...</p>}
      {error && <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {localSkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div onClick={() => handleViewSkillDetails(skill)} className="cursor-pointer mb-4">
              <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{skill.description}</p>
              <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs font-medium text-purple-900">Type: {getSkillTypeLabel(skill.type)}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-900">
                  <span className="font-medium">Status:</span> {skill.status}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleViewSkillDetails(skill)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {localSkills.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No skills yet</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create your first skill
          </button>
        </div>
      )}

      <CreateSkillModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateSkill={handleCreateSkill} />
    </div>
  );
};
