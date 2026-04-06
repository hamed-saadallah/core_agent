import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store';

interface PrivateRouteProps {
  element: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useStore();

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};
