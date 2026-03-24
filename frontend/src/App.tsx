import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { AgentManagement } from './pages/AgentManagement';
import { AgentRunsPage } from './pages/AgentRunsPage';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<AgentManagement />} />
              <Route path="/agent-runs" element={<AgentRunsPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainLayout>
        </div>
      </div>
    </Router>
  );
}

export default App;
