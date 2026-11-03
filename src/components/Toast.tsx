import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md border ${
          toastMessage.type === 'error'
            ? 'bg-rose-900/95 text-white border-rose-700'
            : toastMessage.type === 'info'
            ? 'bg-blue-900/95 text-white border-blue-700'
            : 'bg-slate-900/95 text-white border-slate-700'
        }`}
      >
        {toastMessage.type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
