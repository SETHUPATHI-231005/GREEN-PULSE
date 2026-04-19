/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, Search, FlaskConical, Camera, LogOut, User as UserIcon } from 'lucide-react';

export default function Layout({ children, user, onLogout }: { children: React.ReactNode, user: any, onLogout: () => void }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Crop Recs', icon: Search, path: '/recommend' },
    { label: 'Fertilizer', icon: FlaskConical, path: '/fertilizer' },
    { label: 'Detection', icon: Camera, path: '/detect' },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border-theme flex flex-col h-auto md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-border-theme flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-emerald-900">GreenPulse</span>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    location.pathname === item.path 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-border-theme space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>System Status</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-gray-600">Local Node & Firestore</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-bg-grid">
        {/* Header */}
        <header className="h-20 bg-white border-b border-border-theme flex items-center justify-between px-10 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Farmer's Control Center</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'John Doe'}</p>
              <p className="text-xs text-gray-400 truncate max-w-[150px]">{user?.farmDetails || 'Emerald Valley Farm'}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-emerald-100 flex items-center justify-center text-gray-400 overflow-hidden">
              <div className="text-emerald-700 font-bold">{user?.name?.[0] || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
