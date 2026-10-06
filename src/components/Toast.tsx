import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  text: string;
}

interface Props {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between gap-2 p-3 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-top-3 duration-200 transition-all bg-white border-slate-200">
      <div className="flex items-center gap-2 flex-1">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
        {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
        <span className="text-slate-800 leading-snug">{toast.text}</span>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
