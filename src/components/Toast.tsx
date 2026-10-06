import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, CloudCheck } from 'lucide-react';

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
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold animate-in slide-in-from-top-4 duration-300 transition-all max-w-xl w-[92%] sm:w-auto min-w-[340px] bg-slate-900/95 text-white border-emerald-500/50 backdrop-blur-md">
      <div className="flex items-center gap-2.5 flex-1 text-right">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
          {toast.type === 'success' && <CloudCheck className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            مزامنة سحابية فورية (Cloud Live Sync)
          </span>
          <span className="text-white text-xs font-semibold leading-relaxed mt-0.5">
            {toast.text}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
        title="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
