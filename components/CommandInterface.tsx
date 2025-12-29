import React, { useState } from 'react';
import { Loader, Command } from './icons/Icons';

interface CommandInterfaceProps {
  onSendCommand: (command: string) => void;
  isLoading: boolean;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onSendCommand, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendCommand(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 left-72 right-0 px-8 z-10">
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl -z-10 rounded-2xl" />
        <form onSubmit={handleSubmit} className="glass-panel p-2 rounded-2xl flex items-center gap-3 pl-4 border-primary/30 shadow-neon-cyan">
          <Command className="text-primary animate-pulse flex-shrink-0" size={20} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TrendFlow to analyze, generate, or automate..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 h-10 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 h-10 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Execute'}
          </button>
        </form>
      </div>
    </div>
  );
};
