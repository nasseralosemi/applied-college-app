import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import {
  RotateCcw,
  X,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: ActivityRequest | null;
  onConfirmReturn: (requestId: number, returnReason: string) => void;
}

const PRESET_REASONS = [
  'نقص بالأرقام الجامعية للمتدربين المسجلين في الكشف.',
  'يرجى إرفاق كشف الحضور بصيغة Excel (.xlsx) معتمدة بدلاً من المستند الحالي.',
  'عدم تطابق عدد الحضور مع الساعات التدريبية المعتمدة للنشاط.',
  'الكشف المرفق غير واضح أو ينقصه توقيع منسق النشاط.',
  'تكرار بعض أسماء الطلاب ويُرجى تدقيق ومطابقة السجلات قبل الرفع.',
];

export const AttendanceReturnModal: React.FC<Props> = ({
  isOpen,
  onClose,
  request,
  onConfirmReturn,
}) => {
  const [returnReason, setReturnReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      setError('يرجى كتابة سبب الإعادة والملاحظات المطلوب تعديلها من مقدم الطلب.');
      return;
    }

    onConfirmReturn(request.id, returnReason.trim());
    setReturnReason('');
    setError('');
  };

  const handleSelectPreset = (reason: string) => {
    setReturnReason(reason);
    setError('');
  };

  const isExcel =
    request.attendanceFile?.fileType === 'excel' ||
    request.attendanceFile?.fileName.endsWith('.xlsx');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-md">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                إعادة كشف الحضور للتعديل
              </h3>
              <p className="text-[11px] text-amber-100/90">
                إرجاع الكشف لمقدم الطلب مع تدوين الملاحظات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {/* Request Quick Info */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-800 font-bold">النشاط:</span>
              <span className="text-[10px] text-slate-500 font-mono">#{request.id}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
              {request.name}
            </h4>
            <p className="text-[11px] text-slate-600">
              المقدم: <strong className="text-slate-800">{request.presenter}</strong>
            </p>

            {request.attendanceFile && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-slate-700 bg-white/80 p-2 rounded-xl">
                {isExcel ? (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                ) : (
                  <FileText className="w-4 h-4 text-rose-600" />
                )}
                <span className="font-semibold line-clamp-1 flex-1">
                  {request.attendanceFile.fileName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {request.attendanceFile.fileSize}
                </span>
              </div>
            )}
          </div>

          {/* Preset Chips */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>أسباب وملاحظات سريعة شائعة:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 px-2.5 py-1 rounded-xl border border-slate-200 hover:border-amber-300 transition-all text-right cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Return Reason Textarea */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">
              حقل نصي لإدخال ملاحظات أسباب الإعادة <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={returnReason}
              onChange={(e) => {
                setReturnReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="اكتب بالتفصيل سبب إعادة الطلب وما يجب على مقدم النشاط تعديله في كشف الحضور قبل الاعتماد النهائي..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none font-medium shadow-xs leading-relaxed"
            />
            {error && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Workflow Guarantee Notice */}
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl text-[11px] text-sky-900 space-y-1">
            <strong className="block font-bold">مسار التعديل المباشر:</strong>
            <p className="text-sky-800 leading-relaxed">
              ستظهر هذه الملاحظات لمقدم الطلب في حسابه لتعديل الملف، وسيعيد إرسال الكشف المعدل <strong>مباشرة إليك (مسؤول الرفع)</strong> للاعتماد النهائي وإغلاق الطلب دون الحاجة لإعادة دورة الاعتماد من البداية.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تأكيد إعادة الطلب للتعديل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
