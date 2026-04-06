import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiCopy, FiLoader } from 'react-icons/fi';
import { agentsApi } from '@/api/agents';
import { Agent } from '@/types';

interface ExecuteAgentModalProps {
  isOpen: boolean;
  agent: Agent | null;
  onClose: () => void;
}

export const ExecuteAgentModal: React.FC<ExecuteAgentModalProps> = ({
  isOpen,
  agent,
  onClose,
}) => {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (agent?.promptTemplate) {
      const matches = agent.promptTemplate.match(/{(\w+)}/g);
      if (matches) {
        const params = [...new Set(matches.map((m) => m.slice(1, -1)))];
        const newParams: Record<string, string> = {};
        params.forEach((p) => {
          newParams[p] = '';
        });
        setParameters(newParams);
      }
    }
    setResult(null);
    setError(null);
    setExecutionTime(null);
  }, [agent, isOpen]);

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setError(null);
    setLoading(true);

    try {
      // Validate all parameters are filled
      const emptyParams = Object.entries(parameters)
        .filter(([, value]) => !value.trim())
        .map(([key]) => key);

      if (emptyParams.length > 0) {
        throw new Error(`Please fill in all parameters: ${emptyParams.join(', ')}`);
      }

      const data = await agentsApi.execute(agent.id, parameters);
      const { output, executionTime: time } = data;

      setResult(output);
      setExecutionTime(time);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute agent');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold">Execute Agent</h2>
            <p className="text-sm text-gray-600 mt-1">{agent.name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleExecute} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {!result ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 font-mono">
                  {agent.promptTemplate}
                </p>
              </div>

              {Object.keys(parameters).length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Fill in the parameters:</p>
                  {Object.entries(parameters).map(([paramName, value]) => (
                    <div key={paramName}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {paramName}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleParameterChange(paramName, e.target.value)}
                        disabled={loading}
                        placeholder={`Enter value for {${paramName}}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  No parameters detected in template. Click Execute to run.
                </p>
              )}

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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <FiLoader className="animate-spin" size={18} />}
                  {loading ? 'Executing...' : 'Execute'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-800 font-medium text-sm">Execution completed successfully</p>
                  {executionTime && (
                    <p className="text-green-700 text-xs mt-1">
                      Execution time: {executionTime}ms
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Result</label>
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                  >
                    <FiCopy size={16} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {result?.output || 'No output'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setParameters(
                      Object.keys(parameters).reduce((acc, key) => {
                        acc[key] = '';
                        return acc;
                      }, {} as Record<string, string>)
                    );
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Run Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
