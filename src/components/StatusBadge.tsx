import React from 'react';
import { RequestStatus } from '../types';
import { Clock, AlertTriangle, CheckCircle2, CloudUpload, XCircle, ShieldCheck } from 'lucide-react';

interface Props {
  status: RequestStatus;
  note?: string;
}

export const StatusBadge: React.FC<Props> = ({ status, note }) => {
  switch (status) {
    case 'pending_manager':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-yellow-500/15 text-amber-950 border border-amber-300/80 shadow-xs shadow-amber-500/10 backdrop-blur-xs">
          <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
          <span>بانتظار المدير المباشر</span>
        </span>
      );
    case 'returned_emp':
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500/15 via-red-500/20 to-rose-400/15 text-rose-950 border border-rose-300 shadow-xs shadow-rose-500/10 backdrop-blur-xs">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            <span>مُرجع للتعديل</span>
          </span>
          {note && (
            <span className="text-[10px] text-rose-900 bg-rose-50/95 px-2.5 py-1 rounded-xl border border-rose-200/80 shadow-xs">
              الملاحظة: {note}
            </span>
          )}
        </div>
      );
    case 'pending_auditor':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-sky-500/15 via-blue-500/20 to-cyan-500/15 text-sky-950 border border-sky-300 shadow-xs shadow-sky-500/10 backdrop-blur-xs">
          <ShieldCheck className="w-3 h-3 text-sky-700" />
          <span>معتمد مدير - بانتظار التدقيق</span>
        </span>
      );
    case 'returned_manager':
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-400/20 text-amber-950 border border-amber-400 shadow-xs shadow-amber-500/10 backdrop-blur-xs">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>مُرجع للمدير المباشر</span>
          </span>
          {note && (
            <span className="text-[10px] text-amber-900 bg-amber-50/95 px-2.5 py-1 rounded-xl border border-amber-200 shadow-xs">
              الملاحظة: {note}
            </span>
          )}
        </div>
      );
    case 'approved_final':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/15 text-emerald-950 border border-emerald-400 shadow-xs shadow-emerald-500/10 backdrop-blur-xs">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>معتمد نهائياً - جاهز للرفع</span>
        </span>
      );
    case 'uploaded_irtqaa':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#1b4332]/20 via-[#1b4332]/15 to-[#c59b27]/25 text-[#1b4332] border border-[#c59b27]/50 shadow-xs shadow-[#1b4332]/10 backdrop-blur-xs">
          <CloudUpload className="w-3 h-3 text-[#1b4332]" />
          <span>مرفوع على منصة ارتقاء</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-600/15 text-red-950 border border-red-300 shadow-xs backdrop-blur-xs">
          <XCircle className="w-3 h-3 text-red-700" />
          <span>مرفوض</span>
        </span>
      );
    default:
      return null;
  }
};
