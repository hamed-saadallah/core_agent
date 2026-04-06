import React, { useState } from 'react';
import { ModelManagementTab } from '@/components/tabs/ModelManagementTab';

type TabType = 'api' | 'models';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('api');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-6 py-3 font-medium text-sm transition ${
              activeTab === 'api'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            API Configuration
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-6 py-3 font-medium text-sm transition ${
              activeTab === 'models'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Models
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'api' && (
            <div>
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
          )}

          {activeTab === 'models' && <ModelManagementTab />}
        </div>
      </div>
    </div>
  );
};
