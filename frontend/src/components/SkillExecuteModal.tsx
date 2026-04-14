import React, { useState } from 'react';
import { skillsApi } from '@/api/skills';

interface SkillExecuteModalProps {
  skillId: string;
  isOpen: boolean;
  onClose: () => void;
  inputSchema: Record<string, any>;
}

export const SkillExecuteModal: React.FC<SkillExecuteModalProps> = ({ skillId, isOpen, onClose, inputSchema }) => {
  const [input, setInput] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const getInputFields = (): string[] => {
    try {
      if (inputSchema?.properties && typeof inputSchema.properties === 'object') {
        return Object.keys(inputSchema.properties);
      }
    } catch {
      // Ignore
    }
    return [];
  };

  const inputFields = getInputFields();

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const result = await skillsApi.executeSkill(skillId, input);
      setExecutionResult(result);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute skill');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInput({});
    setError(null);
    setExecutionResult(null);
    setShowResult(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Execute Skill</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!showResult ? (
          <form onSubmit={handleExecute} className="space-y-4">
            {inputFields.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-3">Input Parameters</h3>
                <div className="space-y-3">
                  {inputFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                      <input
                        type="text"
                        value={input[field] || ''}
                        onChange={(e) => setInput((prev) => ({ ...prev, [field]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No input parameters required</p>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Executing...' : 'Execute'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : executionResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Execution Completed</h3>
              <p className="text-green-800">Execution time: {(executionResult.executionTime / 1000).toFixed(2)}s</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Output</h3>
              <pre className="text-xs text-blue-800 overflow-auto max-h-48 bg-white p-2 rounded border">
                {typeof executionResult.output === 'string'
                  ? executionResult.output
                  : JSON.stringify(executionResult.output, null, 2)}
              </pre>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
