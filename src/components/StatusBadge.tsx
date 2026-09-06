import React from 'react';
import { RequestStatus } from '../types';
import { Clock, AlertTriangle, CheckCircle2, CloudUpload, XCircle } from 'lucide-react';

interface Props {
  status: RequestStatus;
  note?: string;
}

export const StatusBadge: React.FC<Props> = ({ status, note }) => {
  switch (status) {
    case 'pending_manager':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>بانتظار المدير المباشر</span>
        </span>
      );
    case 'returned_emp':
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>مُرجع للتعديل</span>
          </span>
          {note && (
            <span className="text-[10px] text-rose-700 bg-rose-50/90 px-2 py-0.5 rounded-lg border border-rose-200">
              الملاحظة: {note}
            </span>
          )}
        </div>
      );
    case 'pending_auditor':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
          <Clock className="w-3 h-3 text-emerald-600" />
          <span>معتمد مدير - بانتظار التدقيق</span>
        </span>
      );
    case 'returned_manager':
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>مُرجع للمدير المباشر</span>
          </span>
          {note && (
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              الملاحظة: {note}
            </span>
          )}
        </div>
      );
    case 'approved_final':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 shadow-xs">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          <span>معتمد نهائياً - جاهز للرفع</span>
        </span>
      );
    case 'uploaded_irtqaa':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20 shadow-xs">
          <CloudUpload className="w-3 h-3 text-[#1b4332]" />
          <span>مرفوع على منصة ارتقاء</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-xs">
          <XCircle className="w-3 h-3 text-red-600" />
          <span>مرفوض</span>
        </span>
      );
    default:
      return null;
  }
};
