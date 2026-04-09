import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiFilter, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { agentRunsApi } from '@/api/agent-runs';
import { agentsApi } from '@/api/agents';
import { AgentRun, Agent } from '@/types';

export const AgentRunsPage: React.FC = () => {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [agentFilter, setAgentFilter] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const agentsData = await agentsApi.getAll();
        setAgents(agentsData.agents);

        const runsData = await agentRunsApi.getAll(
          agentFilter || undefined,
          statusFilter || undefined,
          skip,
          limit
        );
        setRuns(runsData.runs);
        setTotal(runsData.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch runs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, agentFilter, skip]);

  const getAgentName = (agentId: string): string => {
    const agent = agents.find((a) => a.id === agentId);
    return agent?.name || 'Unknown Agent';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle size={18} />;
      case 'failed':
        return <FiAlertCircle size={18} />;
      case 'running':
        return <FiClock size={18} />;
      default:
        return null;
    }
  };

  const handleRunClick = (run: AgentRun) => {
    navigate(`/agents/${run.agentId}/runs/${run.id}`);
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setAgentFilter('');
    setSkip(0);
  };

  const pageCount = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Runs</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent
            </label>
            <select
              value={agentFilter}
              onChange={(e) => {
                setAgentFilter(e.target.value);
                setSkip(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSkip(0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        {(statusFilter || agentFilter) && (
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading runs...</p>
        </div>
      ) : runs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No runs found. Try running an agent.</p>
        </div>
      ) : (
        <>
          {/* Runs List */}
          <div className="space-y-4 mb-6">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => handleRunClick(run)}
                className="w-full bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {getAgentName(run.agentId)}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(run.status)}`}
                      >
                        {getStatusIcon(run.status)}
                        <span className="capitalize">{run.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(run.createdAt).toLocaleDateString()} at{' '}
                      {new Date(run.createdAt).toLocaleTimeString()}
                    </p>
                    {run.error && (
                      <p className="text-sm text-red-600">Error: {run.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {run.executionTime && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Execution Time</p>
                        <p className="font-semibold text-gray-900">
                          {run.executionTime}ms
                        </p>
                      </div>
                    )}
                    <FiArrowRight className="text-gray-400 flex-shrink-0" size={20} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {pageCount} ({total} total runs)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSkip(skip + limit)}
                    disabled={skip + limit >= total}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
