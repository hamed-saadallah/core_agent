import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiTool, FiActivity, FiSettings, FiLink2, FiZap, FiMessageSquare } from 'react-icons/fi';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/agents', label: 'Agents', icon: FiTool },
    { path: '/try-agent', label: 'Try Agent', icon: FiMessageSquare },
    { path: '/chains', label: 'Chains', icon: FiLink2 },
    { path: '/skills', label: 'Skills', icon: FiZap },
    { path: '/agent-runs', label: 'Runs', icon: FiActivity },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <>
      <button className="fixed top-4 left-4 z-50 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">Agent Core</h1>
        </div>

        <nav className="space-y-2 p-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(path) ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};
