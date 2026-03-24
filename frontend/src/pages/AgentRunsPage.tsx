import React from 'react';

export const AgentRunsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Agent Runs</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="border-l-4 border-primary-600 pl-4 py-2">
            <h3 className="font-semibold">Run #1</h3>
            <p className="text-sm text-gray-600">Status: Completed - 2.3s</p>
          </div>
        </div>
      </div>
    </div>
  );
};
