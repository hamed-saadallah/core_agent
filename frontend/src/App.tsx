import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';
import { PrivateRoute } from './components/PrivateRoute';
import { Dashboard } from './pages/Dashboard';
import { AgentManagement } from './pages/AgentManagement';
import { AgentRunsPage } from './pages/AgentRunsPage';
import { Settings } from './pages/Settings';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerificationPage } from './pages/VerificationPage';
import { ProfilePage } from './pages/ProfilePage';
import { useStore } from './store';

function App() {
  const { isAuthenticated } = useStore();

  const PrivateLayout = ({ element }: { element: React.ReactElement }) => (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainLayout>{element}</MainLayout>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerificationPage />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={<PrivateLayout element={<Dashboard />} />}
            />
            <Route
              path="/agents"
              element={<PrivateLayout element={<AgentManagement />} />}
            />
            <Route
              path="/agent-runs"
              element={<PrivateLayout element={<AgentRunsPage />} />}
            />
            <Route
              path="/settings"
              element={<PrivateLayout element={<Settings />} />}
            />
          </>
        ) : (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
