
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandInterface } from './components/CommandInterface';
import { WidgetStream } from './components/WidgetStream';
import { QuickStatsCard } from './components/QuickStatsCard';
import { Message, QuickStat, CampaignIdea } from './types';
import { executeCommand } from './services/toolOrchestrator';
import { Eye, BarChart, DollarSign, Users } from './components/icons/Icons';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignIdea[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  const quickStats: QuickStat[] = [
    { title: "Total Views", value: "1.2M", change: "+12%", Icon: Eye },
    { title: "CTR", value: "4.8%", change: "+0.5%", Icon: BarChart },
    { title: "Revenue", value: "$2,450", change: "+21%", Icon: DollarSign },
    { title: "Affiliates", value: "28", change: "+2", Icon: Users },
  ];

  const handleSendCommand = async (command: string) => {
    if (!command.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: command,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await executeCommand(command);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        ...aiResponse,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, an error occurred while processing your command. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveCampaign = (campaign: CampaignIdea) => {
    const existingIndex = savedCampaigns.findIndex(c => c.id === campaign.id);
    if (existingIndex > -1) {
        const updatedCampaigns = [...savedCampaigns];
        updatedCampaigns[existingIndex] = campaign;
        setSavedCampaigns(updatedCampaigns);
        setToastMessage('Campaign draft updated!');
    } else {
        const newCampaign = { ...campaign, id: `campaign-${Date.now()}` };
        setSavedCampaigns(prev => [...prev, newCampaign]);
        setToastMessage('Campaign draft saved!');
    }
  };
  
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'ai',
        text: "Welcome to TrendFlow AI. How can I help you automate your affiliate marketing today? Try asking me to 'find trends' or 'generate a campaign for tech gadgets'."
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <Sidebar savedCampaigns={savedCampaigns} />
      
      <main className="pl-72">
        <Header />
        <div className="p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {quickStats.map(stat => (
              <QuickStatsCard key={stat.title} {...stat} />
            ))}
          </div>
          <div className="space-y-8 mb-32">
            <WidgetStream messages={messages} isLoading={isLoading} onSaveCampaign={handleSaveCampaign} />
          </div>
        </div>
        <CommandInterface onSendCommand={handleSendCommand} isLoading={isLoading} />
      </main>
      
      <Toast message={toastMessage} show={!!toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default App;
