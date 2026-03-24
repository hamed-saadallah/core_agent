import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <main className="md:ml-64 min-h-screen bg-gray-50">{children}</main>;
};
