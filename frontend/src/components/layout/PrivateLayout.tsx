import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainLayout } from './MainLayout';

interface PrivateLayoutProps {
  element: React.ReactElement;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ element }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Header />
      <MainLayout>{element}</MainLayout>
    </div>
  </div>
);
