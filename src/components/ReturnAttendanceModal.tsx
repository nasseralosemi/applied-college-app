import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import {
  RotateCcw,
  AlertTriangle,
  X,
  FileText,
  Send,
  Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  request: ActivityRequest | null;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export const ReturnAttendanceModal: React.FC<Props> = ({
  isOpen,
  request,
  onConfirm,
  onCancel,
}) => {
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('حقل الملاحظات إجباري: يرجى كتابة سبب الإعادة وتحديد التعديلات المطلوبة من الموظف بدقة.');
      return;
    }
    onConfirm(note.trim());
    setNote('');
    setError('');
  };

  const handleClose = () => {
    setNote('');
    setError('');
    onCancel();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-rose-700/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-rose-200 shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                إعادة كشف الحضور للموظف للتعديل
              </h3>
              <p className="text-[11px] text-rose-200/90 mt-0.5">
                مسؤول الرفع والتوثيق • منصة ارتقاء
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Activity Summary */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-rose-950 font-bold">
              <span>النشاط المستهدف:</span>
              <span className="text-[10px] bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded-full font-mono">
                #{request.id}
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">{request.name}</h4>
            <p className="text-[11px] text-slate-600">
              مقدم الطلب: <strong className="text-slate-800">{request.coordinatorName || request.presenter}</strong>
            </p>
            {request.attendanceSheet?.fileName && (
              <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-1 pt-1 border-t border-rose-200/60">
                <FileText className="w-3 h-3 text-rose-600" />
                <span>الملف الحالي المرفق: {request.attendanceSheet.fileName}</span>
              </p>
            )}
          </div>

          {/* Validation Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              وفق ضوابط التوثيق بمنصة ارتقاء: يجب تدوين ملاحظات واضحة للموظف توضح نواقص الكشف (مثل: نقص بيانات بعض الطلاب، عدم وضوح الختم، أو خطأ في عدد الساعات) لتمكينه من إعادة رفع الكشف المحدث.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mandatory Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              ملاحظات وسبب الإعادة للموظف <span className="text-rose-600">* (حقل إجباري)</span>
            </label>
            <textarea
              required
              rows={4}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: يرجى إعادة رفع الكشف بصيغة معتمدة وإرفاق الأرقام الجامعية لجميع الطلاب الحاضرين للتطابق مع ضوابط منصة ارتقاء..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-300 bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none resize-none font-medium leading-relaxed shadow-xs"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>سيتم إشعار مقدم الطلب فوراً وتفعيل إمكانية إعادة رفع الكشف المحدث لديه.</span>
              <span>{note.length} حرف</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-700/25 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تأكيد إعادة الكشف للموظف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
