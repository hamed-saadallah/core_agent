import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter your API key" />
          </div>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
