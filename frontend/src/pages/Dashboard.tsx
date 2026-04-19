import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Welcome to Agent Core</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Total Agents</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Total Runs</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Active Tools</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Getting Started</h2>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
            <span>Create your first agent in the <strong>Agents</strong> section</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
            <span>Configure tools and prompts for your agents</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
            <span>Execute agents and view runs in the <strong>Runs</strong> section</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
            <span>Manage your settings and preferences</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
