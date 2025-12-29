import React, { useState } from 'react';
import { CampaignIdea } from '../types';
import { Target, ClipboardList, Send, Sparkles, Loader } from './icons/Icons';
import { optimizeCaption } from '../services/geminiService';

interface CampaignBuilderWidgetProps {
  campaign: CampaignIdea;
  onSave: (campaign: CampaignIdea) => void;
}

const InfoSection: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode, onOptimize?: () => void, isOptimizing?: boolean }> = ({ icon: Icon, title, children, onOptimize, isOptimizing }) => (
    <div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
            </div>
            {onOptimize && (
                <button 
                    onClick={onOptimize} 
                    disabled={isOptimizing}
                    className="flex items-center gap-1 text-xs text-secondary hover:text-primary disabled:opacity-50 transition-colors pr-2"
                >
                    {isOptimizing ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    <span>Optimize</span>
                </button>
            )}
        </div>
        <div className="pl-8 text-sm text-gray-400">
            {children}
        </div>
    </div>
);

export const CampaignBuilderWidget: React.FC<CampaignBuilderWidgetProps> = ({ campaign, onSave }) => {
  const [campaignData, setCampaignData] = useState<CampaignIdea>(campaign);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeHook = async () => {
    setIsOptimizing(true);
    try {
        const optimizedHook = await optimizeCaption(campaignData.hook);
        setCampaignData(prev => ({...prev, hook: optimizedHook }));
    } catch (error) {
        console.error("Failed to optimize hook:", error);
    } finally {
        setIsOptimizing(false);
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 max-w-2xl transition-all duration-300 w-full">
        <h3 className="text-lg font-bold text-white mb-4">{campaignData.title}</h3>
        <div className="space-y-4">
            <InfoSection 
                icon={Target} 
                title="Hook (First 3 Seconds)" 
                onOptimize={handleOptimizeHook}
                isOptimizing={isOptimizing}
            >
                <p>{campaignData.hook}</p>
            </InfoSection>
            <InfoSection icon={ClipboardList} title="Script Outline">
                <ul className="list-disc list-outside ml-4 space-y-1">
                    {campaignData.scriptOutline.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </InfoSection>
            <InfoSection icon={Send} title="Call to Action">
                 <p>{campaignData.cta}</p>
            </InfoSection>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
            <button onClick={() => onSave(campaignData)} className="px-4 h-9 rounded-xl bg-surface-highlight border border-white/10 text-white text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors">Save Draft</button>
            <button className="px-4 h-9 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors">Generate Video</button>
        </div>
    </div>
  );
};
