import React from 'react';
import { QuickStat } from '../types';

export const QuickStatsCard: React.FC<QuickStat> = ({ title, value, change, Icon }) => {
  const isPositive = change.startsWith('+');
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-4 flex flex-col justify-between transition-all duration-300">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-2">
        <span className="text-2xl lg:text-3xl font-bold text-white">{value}</span>
        <span className={`ml-2 text-sm font-semibold ${isPositive ? 'text-success' : 'text-red-500'}`}>{change}</span>
      </div>
    </div>
  );
};
