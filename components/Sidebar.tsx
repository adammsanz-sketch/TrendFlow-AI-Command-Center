
import React from 'react';
import { LayoutDashboard, BarChart2, Zap, Settings, FileText, Bot } from './icons/Icons';
import { CampaignIdea } from '../types';

interface SidebarProps {
  savedCampaigns: CampaignIdea[];
}

const NavItem = ({ icon: Icon, text, active }: { icon: React.ElementType, text: string, active?: boolean }) => (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
        active 
          ? 'bg-primary/10 border border-primary/20 text-primary shadow-neon-cyan' 
          : 'text-gray-400 hover:text-white hover:bg-surface-highlight'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span className="font-medium text-sm">{text}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#00F0FF]" />
      )}
    </button>
  );

export const Sidebar: React.FC<SidebarProps> = ({ savedCampaigns }) => {
  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-border bg-[#0A0A0F]/95 backdrop-blur-xl flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 h-16">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-neon-cyan">
           <Bot className="w-5 h-5 text-black" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-white">
          Trend<span className="text-primary">Flow</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <NavItem icon={LayoutDashboard} text="Command Center" active />
        <NavItem icon={BarChart2} text="Trend Research" />
        <NavItem icon={Zap} text="Campaigns" />
        
        {savedCampaigns.length > 0 && (
            <div className="pt-4 mt-4 border-t border-border">
                <h3 className="px-4 mb-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">Drafts</h3>
                <div className="space-y-1">
                    {savedCampaigns.map(campaign => (
                        <a href="#" key={campaign.id} className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-surface-highlight hover:text-white transition-colors duration-200">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium truncate" title={campaign.title}>{campaign.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="glass-panel p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/10" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Adam Sanz</p>
            <p className="text-xs text-primary">Pro Plan</p>
          </div>
          <Settings size={16} className="text-gray-500 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
