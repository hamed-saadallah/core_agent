import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { PrivateLayout } from './components/layout/PrivateLayout';
import { RouteLoadingFallback } from './components/RouteLoadingFallback';
import { useStore } from './store';
import { getCurrentUser } from './api/auth';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const AgentManagement = lazy(() => import('./pages/AgentManagement').then((m) => ({ default: m.AgentManagement })));
const AgentRunsPage = lazy(() => import('./pages/AgentRunsPage').then((m) => ({ default: m.AgentRunsPage })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const VerificationPage = lazy(() => import('./pages/VerificationPage').then((m) => ({ default: m.VerificationPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));

function App() {
  const [isHydrating, setIsHydrating] = useState(true);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  useEffect(() => {
    const hydrate = async () => {
      if (isAuthenticated) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to hydrate current user:', error);
        }
      }
      setIsHydrating(false);
    };

    hydrate();
  }, [isAuthenticated, setCurrentUser]);

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<PrivateLayout element={<Dashboard />} />} />} />
          <Route path="/agents" element={<PrivateRoute element={<PrivateLayout element={<AgentManagement />} />} />} />
          <Route path="/agent-runs" element={<PrivateRoute element={<PrivateLayout element={<AgentRunsPage />} />} />} />
          <Route path="/settings" element={<PrivateRoute element={<PrivateLayout element={<Settings />} />} />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
