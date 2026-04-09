import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCopy, FiCheckCircle, FiAlertCircle, FiClock, FiZap } from 'react-icons/fi';
import { agentRunsApi } from '@/api/agent-runs';
import { agentsApi } from '@/api/agents';
import { AgentRun, Agent } from '@/types';

export const AgentRunDetail: React.FC = () => {
  const { agentId, runId } = useParams<{ agentId: string; runId: string }>();
  const navigate = useNavigate();
  const [run, setRun] = useState<AgentRun | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!agentId || !runId) {
        setError('Agent ID or Run ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const runData = await agentRunsApi.getById(runId);
        setRun(runData);

        const { agents } = await agentsApi.getAll();
        const foundAgent = agents.find((a) => a.id === agentId);
        if (foundAgent) {
          setAgent(foundAgent);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch run details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId, runId]);

  const handleCopyOutput = () => {
    if (run?.output?.output) {
      navigator.clipboard.writeText(run.output.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(`/agents/${agentId}`)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition"
        >
          <FiArrowLeft size={20} />
          Back
        </button>
        <p className="text-gray-600">Loading run details...</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(`/agents/${agentId}`)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition"
        >
          <FiArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error || 'Run not found'}</p>
        </div>
      </div>
    );
  }

  const statusColor =
    run.status === 'completed'
      ? 'green'
      : run.status === 'failed'
        ? 'red'
        : run.status === 'running'
          ? 'blue'
          : 'gray';

  const isMocked = run.output?.output?.includes('simulated execution result');

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/agents/${agentId}`)}
          className="text-indigo-600 hover:text-indigo-700 transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <button
          onClick={() => navigate('/agent-runs')}
          className="text-indigo-600 hover:text-indigo-700 transition text-sm"
        >
          All Runs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{agent?.name || 'Run Details'}</h1>
          <p className="text-gray-600">
            Execution on {new Date(run.createdAt).toLocaleDateString()} at{' '}
            {new Date(run.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Status and Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border-l-4 rounded-lg p-4 ${
              statusColor === 'green'
                ? 'border-green-500 bg-green-50'
                : statusColor === 'red'
                  ? 'border-red-500 bg-red-50'
                  : statusColor === 'blue'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-500 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {statusColor === 'green' && (
                <FiCheckCircle className="text-green-600" />
              )}
              {statusColor === 'red' && (
                <FiAlertCircle className="text-red-600" />
              )}
              <p className="text-sm font-medium text-gray-700">Status</p>
            </div>
            <p
              className={`text-lg font-semibold capitalize ${
                statusColor === 'green'
                  ? 'text-green-900'
                  : statusColor === 'red'
                    ? 'text-red-900'
                    : statusColor === 'blue'
                      ? 'text-blue-900'
                      : 'text-gray-900'
              }`}
            >
              {run.status}
            </p>
          </div>

          {run.executionTime && (
            <div className="border-l-4 border-indigo-500 rounded-lg p-4 bg-indigo-50">
              <div className="flex items-center gap-2 mb-1">
                <FiClock className="text-indigo-600" />
                <p className="text-sm font-medium text-gray-700">Execution Time</p>
              </div>
              <p className="text-lg font-semibold text-indigo-900">
                {run.executionTime}ms
              </p>
            </div>
          )}

          {run.error && (
            <div className="border-l-4 border-red-500 rounded-lg p-4 bg-red-50">
              <p className="text-sm font-medium text-red-700">Error</p>
              <p className="text-sm text-red-600 mt-1">{run.error}</p>
            </div>
          )}
        </div>

        {/* Mock Indicator */}
        {isMocked && (
          <div className="border-l-4 border-orange-500 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center gap-2">
              <FiZap className="text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Simulation Mode</p>
                <p className="text-sm text-orange-700 mt-1">
                  This execution is mocked. In production, this would call the actual LLM model.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Parameters */}
        {run.input && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Input</h2>
            {run.input.parameters && Object.keys(run.input.parameters).length > 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                {Object.entries(run.input.parameters).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-700">{key}</p>
                    <p className="text-sm text-gray-900 font-mono break-words">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm italic">No parameters provided</p>
            )}
            {run.input.template && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Template</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <pre className="text-xs text-blue-900 font-mono whitespace-pre-wrap break-words">
                    {run.input.template}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {run.output && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Output</h2>
              {run.output.output && (
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                >
                  <FiCopy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            {run.output.output ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {run.output.output}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm italic">No output available</p>
            )}

            {run.output.model && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {run.output.model && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium mb-1">Model</p>
                    <p className="text-sm font-semibold text-purple-900">
                      {run.output.model}
                    </p>
                  </div>
                )}
                {run.output.version && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium mb-1">Version</p>
                    <p className="text-sm font-semibold text-purple-900">
                      {run.output.version}
                    </p>
                  </div>
                )}
                {run.output.temperature !== undefined && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium mb-1">
                      Temperature
                    </p>
                    <p className="text-sm font-semibold text-purple-900">
                      {run.output.temperature.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Run Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Run ID</p>
              <p className="font-medium text-gray-900 text-xs break-all">{run.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Agent ID</p>
              <p className="font-medium text-gray-900 text-xs break-all">{run.agentId}</p>
            </div>
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(run.createdAt).toLocaleDateString()} at{' '}
                {new Date(run.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(run.updatedAt).toLocaleDateString()} at{' '}
                {new Date(run.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-6 flex gap-3">
          <button
            onClick={() => navigate(`/agents/${agentId}`)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Back to Agent
          </button>
          <button
            onClick={() => navigate('/agent-runs')}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            View All Runs
          </button>
        </div>
      </div>
    </div>
  );
};
