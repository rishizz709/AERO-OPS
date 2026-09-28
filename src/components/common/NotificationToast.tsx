import React from 'react';
import { useAodb } from '../../context/AodbContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, setNotification } = useAodb();

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
    }
  };

  const getBorder = () => {
    switch (notification.type) {
      case 'success':
        return 'border-emerald-500/40 bg-[#062419]';
      case 'warning':
        return 'border-amber-500/40 bg-[#2b1c06]';
      case 'error':
        return 'border-red-500/40 bg-[#29090b]';
      default:
        return 'border-cyan-500/40 bg-[#081f33]';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md max-w-md ${getBorder()} text-slate-100`}>
        {getIcon()}
        <div className="text-xs font-medium leading-relaxed flex-1">
          {notification.message}
        </div>
        <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded transition">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
