import React, { useState, useEffect } from 'react';
import { chainsApi } from '@/api/chains';
import { IntermediateResult } from '@/types';

interface ExecuteChainModalProps {
  chainId: string;
  isOpen: boolean;
  onClose: () => void;
  startingPrompt: string;
}

export const ExecuteChainModal: React.FC<ExecuteChainModalProps> = ({ chainId, isOpen, onClose, startingPrompt }) => {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [extractedParams, setExtractedParams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const regex = /{(\w+)}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(startingPrompt)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    setExtractedParams(matches);
    setParameters(matches.reduce((acc, param) => ({ ...acc, [param]: '' }), {}));
  }, [startingPrompt]);

  if (!isOpen) return null;

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const result = await chainsApi.execute(chainId, parameters);
      setExecutionResult(result);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute chain');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setParameters(extractedParams.reduce((acc, param) => ({ ...acc, [param]: '' }), {}));
    setError(null);
    setExecutionResult(null);
    setShowResult(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Execute Chain</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!showResult ? (
          <form onSubmit={handleExecute} className="space-y-4">
            {extractedParams.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                <div className="space-y-3">
                  {extractedParams.map((param) => (
                    <div key={param}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{param}</label>
                      <input
                        type="text"
                        value={parameters[param] || ''}
                        onChange={(e) => setParameters((prev) => ({ ...prev, [param]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter value for {${param}}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No parameters required</p>
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

            {executionResult.intermediateResults && executionResult.intermediateResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Execution Steps</h3>
                <div className="space-y-3">
                  {executionResult.intermediateResults.map((result: IntermediateResult, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Step {result.nodeOrder + 1}</p>
                          <p className="text-sm text-gray-600">Agent: {result.agentId}</p>
                          <p className="text-xs text-gray-500 mt-1">Time: {(result.executionTime / 1000).toFixed(2)}s</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            result.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>

                      {result.output && (
                        <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-1">Output:</p>
                          <pre className="text-xs text-gray-600 overflow-auto max-h-24">
                            {typeof result.output === 'string'
                              ? result.output
                              : JSON.stringify(result.output, null, 2)}
                          </pre>
                        </div>
                      )}

                      {result.error && (
                        <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs font-medium text-red-700">Error: {result.error}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Final Output</h3>
              <pre className="text-xs text-blue-800 overflow-auto max-h-32">
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
