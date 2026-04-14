import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlay, FiEdit, FiTrash2, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { agentsApi } from '@/api/agents';
import { skillsApi } from '@/api/skills';
import { Agent, Skill } from '@/types';
import { ExecuteAgentModal } from '@/components/modals/ExecuteAgentModal';
import { EditAgentModal } from '@/components/modals/EditAgentModal';
import { SkillSelector } from '@/components/SkillSelector';

export const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) {
        setError('Agent ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { agents } = await agentsApi.getAll();
        const foundAgent = agents.find((a) => a.id === id);
        if (!foundAgent) {
          setError('Agent not found');
        } else {
          setAgent(foundAgent);
          setSkills(foundAgent.skills || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agent');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleRunAgent = () => {
    if (!agent?.promptTemplate) {
      setError('This agent does not have a prompt template configured');
      return;
    }
    setIsExecuteModalOpen(true);
  };

  const handleEditAgent = () => {
    setIsEditModalOpen(true);
  };

  const handleAssignSkill = async (skillId: string) => {
    if (!agent || !id) return;
    try {
      await skillsApi.assignToAgent(skillId, id);
      const updatedAgent = await agentsApi.getById(id);
      setAgent(updatedAgent);
      setSkills(updatedAgent.skills || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign skill');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!agent || !id) return;
    try {
      await skillsApi.removeFromAgent(skillId, id);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove skill');
    }
  };

  const handleDeleteAgent = async () => {
    if (!agent || !window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await agentsApi.delete(agent.id);
      navigate('/agents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/agents')}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <FiArrowLeft size={20} />
          </button>
        </div>
        <p className="text-gray-600">Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/agents')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition"
        >
          <FiArrowLeft size={20} />
          Back to Agents
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error || 'Agent not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate('/agents')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition"
      >
        <FiArrowLeft size={20} />
        Back to Agents
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{agent.name}</h1>
          <p className="text-gray-600 text-lg">{agent.description}</p>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              agent.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {agent.status}
          </span>
        </div>

        {/* Model Information */}
        {agent.model && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Model Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1">Model Name</p>
                <p className="text-lg font-semibold text-purple-900">{agent.model.name}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1">Version</p>
                <p className="text-lg font-semibold text-purple-900">v{agent.model.version}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1">Temperature</p>
                <p className="text-lg font-semibold text-purple-900">
                  {agent.temperature?.toFixed(2) ?? agent.model?.temperature?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prompt Template */}
        {agent.promptTemplate && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Prompt Template</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <pre className="text-sm text-blue-900 font-mono whitespace-pre-wrap break-words">
                {agent.promptTemplate}
              </pre>
            </div>
          </div>
        )}

        {/* Tools */}
        {agent.tools && agent.tools.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Associated Tools</h2>
            <div className="space-y-2">
              {agent.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-medium text-gray-900">{tool.name}</p>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="border-t border-gray-200 pt-6">
          <SkillSelector
            agentId={agent.id}
            assignedSkills={skills}
            onAssign={handleAssignSkill}
            onRemove={handleRemoveSkill}
          />
        </div>

        {/* Metadata */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(agent.createdAt).toLocaleDateString()} at{' '}
                {new Date(agent.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(agent.updatedAt).toLocaleDateString()} at{' '}
                {new Date(agent.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">ID</p>
              <p className="font-medium text-gray-900 text-xs break-all">{agent.id}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-6 flex gap-3">
          {agent.promptTemplate && (
            <button
              onClick={handleRunAgent}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              <FiPlay size={18} />
              Run Agent
            </button>
          )}
          <button
            onClick={handleEditAgent}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <FiEdit size={18} />
            Edit
          </button>
          <button
            onClick={handleDeleteAgent}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition ml-auto"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Modals */}
      <ExecuteAgentModal
        isOpen={isExecuteModalOpen}
        agent={agent}
        onClose={() => setIsExecuteModalOpen(false)}
        onExecutionComplete={(runId) => {
          navigate(`/agents/${agent.id}/runs/${runId}`);
        }}
      />

      <EditAgentModal
        isOpen={isEditModalOpen}
        agent={agent}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updatedAgent) => {
          setAgent(updatedAgent);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
};
