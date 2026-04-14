import React, { useEffect, useState } from 'react';
import { skillsApi } from '@/api/skills';
import { Skill } from '@/types';

interface SkillSelectorProps {
  agentId: string;
  assignedSkills: Skill[];
  onAssign: (skillId: string) => void;
  onRemove: (skillId: string) => void;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({ agentId, assignedSkills, onAssign, onRemove }) => {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const { skills } = await skillsApi.getAll(0, 100);
        setAvailableSkills(skills);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      } finally {
        setLoading(false);
      }
    };

    if (showSelector) {
      fetchSkills();
    }
  }, [showSelector]);

  const unassignedSkills = availableSkills.filter((s) => !assignedSkills.find((as) => as.id === s.id));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Assigned Skills</h3>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          {showSelector ? 'Close' : 'Add Skills'}
        </button>
      </div>

      {assignedSkills.length > 0 ? (
        <div className="space-y-2 mb-4">
          {assignedSkills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <div>
                <p className="font-semibold text-blue-900">{skill.name}</p>
                <p className="text-xs text-blue-700">{skill.type}</p>
              </div>
              <button
                onClick={() => onRemove(skill.id)}
                className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm mb-4">No skills assigned yet</p>
      )}

      {showSelector && (
        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <h4 className="font-semibold mb-3">Available Skills</h4>
          {loading ? (
            <p className="text-gray-600">Loading skills...</p>
          ) : unassignedSkills.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unassignedSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => {
                    onAssign(skill.id);
                  }}
                  className="w-full text-left p-3 border border-gray-300 rounded hover:bg-blue-50 transition"
                >
                  <p className="font-semibold text-sm">{skill.name}</p>
                  <p className="text-xs text-gray-600">{skill.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No available skills to assign</p>
          )}
        </div>
      )}
    </div>
  );
};
