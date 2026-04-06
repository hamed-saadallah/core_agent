import React from 'react';
import { ProfileMenu } from '../ProfileMenu';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 md:ml-64 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{title || 'Dashboard'}</h2>
      <ProfileMenu />
    </header>
  );
};
