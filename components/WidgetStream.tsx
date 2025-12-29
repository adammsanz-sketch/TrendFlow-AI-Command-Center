
import React, { useEffect, useRef } from 'react';
import { Message, CampaignIdea } from '../types';
import { TrendCardWidget } from './TrendCardWidget';
import { CampaignBuilderWidget } from './CampaignBuilderWidget';
import { Bot, Loader, BrainCircuit } from './icons/Icons';

interface WidgetStreamProps {
  messages: Message[];
  isLoading: boolean;
  onSaveCampaign: (campaign: CampaignIdea) => void;
}

const MessageBubble: React.FC<{ message: Message; onSaveCampaign: (campaign: CampaignIdea) => void }> = ({ message, onSaveCampaign }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-primary/10 border border-primary/20 text-primary px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 shadow-neon-cyan" />
      <div className="flex flex-col gap-4 w-full">
        {message.text && (
          <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-sm text-gray-300 max-w-lg">
            {message.thinking && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                    <BrainCircuit className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Deep Analysis</span>
                </div>
            )}
            {message.text}
          </div>
        )}
        {message.widget?.type === 'TREND_CARD' && (
          <div className="flex gap-4 overflow-x-auto pb-4 -ml-4 pl-4">
             {message.widget.data.map(trend => <div className="flex-shrink-0 w-80"><TrendCardWidget key={trend.id} trend={trend} /></div>)}
          </div>
        )}
        {message.widget?.type === 'CAMPAIGN_BUILDER' && (
            <CampaignBuilderWidget campaign={message.widget.data} onSave={onSaveCampaign} />
        )}
      </div>
    </div>
  );
};

export const WidgetStream: React.FC<WidgetStreamProps> = ({ messages, isLoading, onSaveCampaign }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-0 space-y-8">
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} onSaveCampaign={onSaveCampaign} />)}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 shadow-neon-cyan" />
                <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-sm">
                  <Loader className="w-5 h-5 text-primary animate-spin" />
                </div>
              </div>
            )}
        </div>
    );
};