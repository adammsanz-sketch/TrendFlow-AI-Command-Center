import React from 'react';
import { Trend } from '../types';
import { ArrowUpRight, Sparkles } from './icons/Icons';

interface TrendCardWidgetProps {
  trend: Trend;
}

const getDifficultyClass = (difficulty: 'Easy' | 'Med' | 'Hard') => {
    switch(difficulty) {
        case 'Easy': return 'text-success';
        case 'Med': return 'text-yellow-500';
        case 'Hard': return 'text-red-500';
        default: return 'text-gray-400';
    }
}

export const TrendCardWidget: React.FC<TrendCardWidgetProps> = ({ trend }) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 w-full h-full flex flex-col group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              {trend.type.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {trend.title}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-highlight border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors flex-shrink-0">
          <ArrowUpRight size={20} className="text-primary w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Posts</p>
          <p className="text-sm font-mono font-bold text-white">{(trend.posts / 1000000).toFixed(1)}M</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Growth</p>
          <p className="text-sm font-mono font-bold text-success">+{trend.growth}%</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20 border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Difficulty</p>
          <p className={`text-sm font-mono font-bold ${getDifficultyClass(trend.difficulty)}`}>{trend.difficulty}</p>
        </div>
      </div>
      
      <div className="mt-auto">
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/50 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all group-hover:shadow-neon-cyan">
            <Sparkles size={16} className="text-primary w-4 h-4" />
            Generate Campaign
        </button>
      </div>
    </div>
  );
};
