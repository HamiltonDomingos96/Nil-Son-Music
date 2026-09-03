import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      id="toast-notification-pill"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#e59a38] text-[#120d09] font-black text-xs md:text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 border border-[#f5a746]/40"
    >
      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
      <span>{message}</span>
      <button 
        onClick={onDismiss}
        className="p-0.5 rounded-full hover:bg-black/10 text-black/70 hover:text-black transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
