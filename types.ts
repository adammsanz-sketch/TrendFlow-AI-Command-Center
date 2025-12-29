
import React from 'react';

export interface Trend {
  id: string;
  sourceId: string;
  type: 'Hashtag' | 'Sound';
  title: string;
  source: string;
  engagementVelocity: number[];
  posts: number;
  growth: number;
  difficulty: 'Easy' | 'Med' | 'Hard';
}

export interface CampaignIdea {
  id?: string;
  title: string;
  hook: string;
  scriptOutline: string[];
  cta: string;
}

export type Widget = 
  | { type: 'TREND_CARD'; data: Trend[] }
  | { type: 'CAMPAIGN_BUILDER'; data: CampaignIdea };

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  widget?: Widget;
  thinking?: boolean;
}

export interface QuickStat {
    title: string;
    value: string;
    change: string;
    Icon: React.ElementType;
}