import React, { useState, useEffect } from 'react';
import { CheckCircle } from './icons/Icons';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`fixed top-8 right-8 transition-all duration-300 z-50 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
      {show && (
        <div className="glass-panel p-4 flex items-center gap-3 rounded-xl border-primary/20 shadow-neon-cyan">
          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
      )}
    </div>
  );
};
