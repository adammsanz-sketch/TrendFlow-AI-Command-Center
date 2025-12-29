
import React from 'react';
import { Bell, User } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-highlight border border-white/5 text-sm">
            <span>Search trends...</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-300">⌘K</span>
          </div>
        </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 hover:bg-surface-highlight rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-neon-cyan" />
        </button>
      </div>
    </header>
  );
};
