import React, { useState, useRef } from 'react';
import { ActivityRequest, AttendanceSheet } from '../types';
import {
  UploadCloud,
  FileCheck,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  request: ActivityRequest | null;
  onUpload: (requestId: number, sheetData: AttendanceSheet) => void;
  onClose: () => void;
  currentUserEmpNumber?: string;
}

export const UploadAttendanceModal: React.FC<Props> = ({
  isOpen,
  request,
  onUpload,
  onClose,
  currentUserEmpNumber,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [attendeesCount, setAttendeesCount] = useState<number>(35);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [isUsingSample, setIsUsingSample] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !request) return null;

  const isReupload = request.attendanceSheet?.status === 'returned';
  const previousReturnNote = request.attendanceSheet?.returnNote;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setCustomFileName(selected.name);
      setIsUsingSample(false);
      setError('');
    }
  };

  const handleUseSample = () => {
    setIsUsingSample(true);
    setFile(null);
    setCustomFileName(`كشف_حضور_${request.name.replace(/\s+/g, '_')}_نهائي_معتمد.pdf`);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file && !isUsingSample) {
      setError('يرجى اختيار ملف كشف الحضور (PDF أو Excel أو صورة) أو الضغط على استخدام نموذج كشف جاهز.');
      return;
    }

    if (!attendeesCount || attendeesCount <= 0) {
      setError('يرجى تحديد عدد المتدربين والطلاب الحاضرين في الكشف.');
      return;
    }

    const nowIso = new Date().toISOString();
    const finalFileName = file ? file.name : (customFileName || `كشف_حضور_${request.name.replace(/\s+/g, '_')}.pdf`);
    const finalFileSize = file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '1.35 MB';

    // If a real file was uploaded, read as Data URL so download and preview can use it
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const sheet: AttendanceSheet = {
          fileName: finalFileName,
          fileSize: finalFileSize,
          fileUrl: reader.result as string,
          uploadedAt: nowIso,
          uploadedBy: currentUserEmpNumber || request.presenter,
          attendeesCount: Number(attendeesCount),
          status: 'pending_review',
        };
        onUpload(request.id, sheet);
        handleClose();
      };
      reader.readAsDataURL(file);
    } else {
      const sheet: AttendanceSheet = {
        fileName: finalFileName,
        fileSize: finalFileSize,
        uploadedAt: nowIso,
        uploadedBy: currentUserEmpNumber || request.presenter,
        attendeesCount: Number(attendeesCount),
        status: 'pending_review',
      };
      onUpload(request.id, sheet);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setIsUsingSample(false);
    setCustomFileName('');
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#c59b27]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27]/50 flex items-center justify-center text-[#e6c566] shadow-sm">
              {isReupload ? <RotateCcw className="w-5 h-5 text-amber-300" /> : <UploadCloud className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                  {isReupload ? 'إعادة رفع كشف الحضور المحدث' : 'رفع كشف الحضور الختامي للنشاط'}
                </h3>
                <span className="text-[10px] bg-[#c59b27] text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  الكلية التطبيقية
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                مرحلة التوثيق والإغلاق الرسمي • منصة ارتقاء
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Activity Target Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1">
            <span className="text-[10px] font-bold text-[#1b4332] block">النشاط المنتهي:</span>
            <h4 className="font-extrabold text-slate-900 text-sm">{request.name}</h4>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span>تاريخ الانتهاء: {request.endDate || request.startDate || request.date}</span>
              <span>• الساعات: {request.hours} ساعات</span>
              <span>• الفرع: {request.branch || 'فرع الكلية'}</span>
            </div>
          </div>

          {/* Show Return Notes if Re-uploading */}
          {isReupload && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs space-y-1.5 animate-fade-slide-up">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ملاحظات مسؤول الرفع (يرجى استيفاؤها في الكشف المحدث):</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-rose-200/80 text-slate-800 leading-relaxed font-medium">
                {previousReturnNote || 'يرجى مراجعة الكشف وتحديث البيانات وفق النموذج المعتمد لمنصة ارتقاء.'}
              </div>
              <p className="text-[10px] text-rose-700">
                عند إرسال الكشف المحدث، سيتم إشعار مسؤول الرفع تلقائياً لإعادة التدقيق والاعتماد.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              ملف كشف الحضور المعتمد <span className="text-rose-500">* (PDF أو Excel أو صورة)</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all duration-200 ${
                file || isUsingSample
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-[#1b4332] bg-slate-50/70 hover:bg-slate-100/70'
              }`}
            >
              {file || isUsingSample ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                    <FileCheck className="w-6 h-6 text-emerald-700" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {file ? file.name : customFileName}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-semibold">
                    {file ? `الحجم: ${(file.size / (1024 * 1024)).toFixed(2)} MB • جاهز للرفع` : 'نموذج كشف رسمي جاهز للاعتماد'}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-[11px] text-[#1b4332] hover:underline font-bold"
                  >
                    تغيير الملف المحدد
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-200/80 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6 text-[#1b4332]" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    انقر هنا لاختيار ملف كشف الحضور من جهازك
                  </p>
                  <p className="text-[10px] text-slate-500">
                    الصيغ المدعومة: PDF, Excel (.xlsx, .csv), الصور الرسمية
                  </p>
                </div>
              )}
            </div>

            {/* Quick Sample Button */}
            {!file && !isUsingSample && (
              <div className="mt-2 flex items-center justify-between bg-amber-50/80 border border-amber-200/70 rounded-2xl p-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>توليد نموذج كشف حضور متكامل بضغطة واحدة:</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-[10px] bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold px-3 py-1 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  استخدام نموذج الكشف المعتمد
                </button>
              </div>
            )}
          </div>

          {/* Attendees Count Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              عدد الحضور الفعلي المسجلين بالكشف <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              required
              value={attendeesCount}
              onChange={(e) => setAttendeesCount(Number(e.target.value))}
              placeholder="مثال: 35"
              className="w-full text-xs px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/30 outline-none font-bold text-slate-900 shadow-xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              سيتم رصد هذا العدد رسمياً في إحصائيات تقارير النشاط ومنصة ارتقاء.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] text-xs font-bold shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all cursor-pointer border border-[#c59b27]/30"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isReupload ? 'إرسال الكشف المحدث لمسؤول الرفع' : 'تأكيد رفع كشف الحضور للاعتماد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
