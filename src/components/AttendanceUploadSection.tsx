import React, { useState, useRef } from 'react';
import { ActivityRequest, AttendanceFile } from '../types';
import {
  createSampleAttendanceFile,
  downloadAttendanceFile,
  parseUploadedFile,
} from '../utils/attendanceUtils';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  RotateCcw,
  Send,
  Sparkles,
  FileCheck,
  Eye,
  Info,
  Clock,
  Check,
  Trash2,
} from 'lucide-react';

interface Props {
  request: ActivityRequest;
  onSubmitAttendance: (
    requestId: number,
    file: AttendanceFile,
    notes?: string,
    isResubmission?: boolean
  ) => void;
  onViewAttendance?: (request: ActivityRequest) => void;
}

export const AttendanceUploadSection: React.FC<Props> = ({
  request,
  onSubmitAttendance,
  onViewAttendance,
}) => {
  const [selectedFile, setSelectedFile] = useState<AttendanceFile | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReturned = request.status === 'attendance_returned';
  const isSubmitted = request.status === 'attendance_submitted';
  const isCompleted = request.status === 'uploaded_irtqaa';
  const isReadyForFirstUpload = request.status === 'approved_final' && !request.attendanceFile;

  // Handle native file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsProcessing(true);
    try {
      const parsed = await parseUploadedFile(file, notes);
      setSelectedFile(parsed);
    } catch {
      setErrorMessage('حدث خطأ أثناء قراءة الملف. يرجى اختيار ملف Excel أو PDF صالح.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick preset test file selection
  const handleUsePreset = (format: 'excel' | 'pdf') => {
    setErrorMessage('');
    const sample = createSampleAttendanceFile(request.name, format, request.hours);
    setSelectedFile(sample);
  };

  // Submit action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('يرجى اختيار ملف كشف الحضور (Excel أو PDF) أولاً.');
      return;
    }

    const fileToSubmit: AttendanceFile = {
      ...selectedFile,
      notes: notes.trim() || selectedFile.notes,
    };

    onSubmitAttendance(request.id, fileToSubmit, notes, isReturned);
    setSelectedFile(null);
    setNotes('');
  };

  const handleDownloadExisting = () => {
    if (request.attendanceFile) {
      downloadAttendanceFile(request.attendanceFile);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/90 text-right">
      {/* 1. STATE: Returned for modification (Requirement 3) */}
      {isReturned && (
        <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-3.5 sm:p-4 space-y-3 mb-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-1.5">
                  <span>تنبيه: كشف الحضور مُعاد للتعديل من مسؤول ارتقاء</span>
                </h5>
                {request.attendanceReturnedAt && (
                  <span className="text-[10px] text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded font-mono">
                    {request.attendanceReturnedAt}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-rose-800 mt-0.5">
                يرجى تصحيح الملاحظات وإعادة إرفاق الكشف لإرساله مباشرة للمسؤول للاعتماد النهائي.
              </p>
            </div>
          </div>

          {/* Return Reason Box */}
          <div className="bg-white/90 border border-rose-200 p-3 rounded-xl text-xs space-y-1">
            <strong className="text-rose-900 block font-bold text-[11px] flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-rose-600" />
              <span>ملاحظات مسؤول الرفع والتوثيق (أسباب الإعادة):</span>
            </strong>
            <p className="text-slate-800 font-medium leading-relaxed bg-rose-50/50 p-2 rounded-lg border border-rose-100">
              {request.attendanceReturnReason || 'يرجى مراجعة وتحديث كشف الحضور والتأكد من مطابقة الساعات.'}
            </p>
          </div>

          {/* Previously submitted file if any */}
          {request.attendanceFile && (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[11px] text-slate-500 block">الملف المُعاد:</span>
                  <span className="font-semibold text-slate-700 line-clamp-1">
                    {request.attendanceFile.fileName}
                  </span>
                </div>
              </div>
              {onViewAttendance && (
                <button
                  type="button"
                  onClick={() => onViewAttendance(request)}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>معاينة</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. STATE: Already submitted - Pending Uploader Review */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/90 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-3.5 h-3.5 animate-spin-slow" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-950">
                  تم إرفاق كشف الحضور بنجاح
                </h5>
                <p className="text-[10px] text-emerald-800">
                  بانتظار تدقيق مسؤول الرفع والتوثيق (ارتقاء) للاعتماد النهائي
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              قيد التدقيق
            </span>
          </div>

          {request.attendanceFile && (
            <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 line-clamp-1">
                {request.attendanceFile.fileType === 'pdf' ? (
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-900 text-[11px] block line-clamp-1">
                    {request.attendanceFile.fileName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {request.attendanceFile.fileSize} • تاريخ الرفع: {request.attendanceFile.uploadedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onViewAttendance && (
                  <button
                    type="button"
                    onClick={() => onViewAttendance(request)}
                    className="text-[11px] font-bold text-[#1b4332] hover:text-[#c59b27] bg-[#1b4332]/10 hover:bg-[#1b4332]/15 px-2.5 py-1 rounded-lg border border-[#1b4332]/20 cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3 h-3 text-[#1b4332]" />
                    <span>عرض</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownloadExisting}
                  className="text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>تحميل</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. STATE: Fully Completed in Irtqaa */}
      {isCompleted && (
        <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">
                كشف الحضور معتمد وموثق بالسجل المهاري (ارتقاء)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
              مكتمل ومغلق
            </span>
          </div>

          {request.attendanceFile && (
            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-100 text-xs">
              <div className="flex items-center gap-1.5 line-clamp-1">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium text-slate-800 line-clamp-1">
                  {request.attendanceFile.fileName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {onViewAttendance && (
                  <button
                    type="button"
                    onClick={() => onViewAttendance(request)}
                    className="text-[10px] font-bold text-[#1b4332] bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>عرض الكشف</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownloadExisting}
                  className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>تحميل</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FORM: Upload / Resubmit Box (Requirement 1 & Requirement 3) */}
      {(isReadyForFirstUpload || isReturned) && (
        <div className="bg-slate-50/80 border border-[#c59b27]/40 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#1b4332] text-[#e6c566] flex items-center justify-center text-xs font-bold shadow-xs">
                ★
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1b4332]">
                  {isReturned
                    ? 'إعادة رفع كشف الحضور المعدل (مسار التعديل المباشر)'
                    : 'المرحلة النهائية المستقلة: إرفاق كشف الحضور'}
                </h5>
                <p className="text-[10px] text-slate-500">
                  {isReturned
                    ? 'أرفق الكشف المعدل لإرساله مباشرة لمسؤول الرفع والتوثيق'
                    : 'بعد انتهاء الفعالية، أرفق كشف الحضور لتوثيق النشاط دون المساس بالبيانات الأصلية'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#c59b27] bg-[#c59b27]/10 px-2 py-0.5 rounded-full border border-[#c59b27]/30">
              Excel / PDF
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* File Dropzone & Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setIsProcessing(true);
                    try {
                      const parsed = await parseUploadedFile(file, notes);
                      setSelectedFile(parsed);
                    } catch {
                      setErrorMessage('حدث خطأ في قراءة الملف.');
                    } finally {
                      setIsProcessing(false);
                    }
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#c59b27] bg-[#c59b27]/10'
                    : 'border-slate-300 hover:border-[#1b4332] bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5 text-[#1b4332]" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  انقر هنا لاختيار كشف الحضور من جهازك أو اسحب الملف وأفلته هنا
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  الصيغ المدعومة: ملفات إكسل (Excel .xlsx / .xls / .csv) أو مستندات (PDF)
                </p>

                {/* Quick Presets for fast testing */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[10px] text-slate-400">أو للتجربة السريعة:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUsePreset('excel');
                    }}
                    className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    <span>كشف Excel جاهز للنشاط</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUsePreset('pdf');
                    }}
                    className="text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-rose-600" />
                    <span>كشف PDF معتمد</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Selected File Card */
              <div className="bg-white p-3 rounded-2xl border-2 border-[#1b4332]/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 line-clamp-1">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      {selectedFile.fileType === 'pdf' ? (
                        <FileText className="w-4 h-4 text-rose-600" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                        {selectedFile.fileName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedFile.fileSize} • جاهز للإرسال
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-[#1b4332] hover:underline font-bold px-2 py-1 cursor-pointer"
                    >
                      تغيير الملف
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer"
                      title="إلغاء التحديد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Optional notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ملاحظات إضافية حول الحضور (اختياري):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: تم تدقيق وتطابق أرقام الطلاب، أو عدد الحضور الفعلي 32 طالباً..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-medium shadow-xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                !selectedFile || isProcessing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : isReturned
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-amber-600/25 active:scale-95'
                  : 'bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] shadow-[#1b4332]/25 active:scale-95 border border-[#c59b27]/30'
              }`}
            >
              {isReturned ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة إرسال كشف الحضور المعدل مباشرة لمسؤول الرفع</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال كشف الحضور لتوثيق النشاط (لمسؤول ارتقاء)</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
