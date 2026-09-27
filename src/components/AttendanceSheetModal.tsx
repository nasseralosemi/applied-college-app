import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { openOrDownloadAttendanceFile } from '../utils/fileStorage';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Users,
  ShieldCheck,
  Award,
  ExternalLink,
  Eye,
  FileCheck,
  RotateCcw,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveAndClose?: (requestId: number) => void;
  onReturnRequest?: (requestId: number) => void;
  isUploaderRole?: boolean;
}

export const AttendanceSheetModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
  onApproveAndClose,
  onReturnRequest,
  isUploaderRole = false,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen || !request || !request.attendanceSheet) return null;

  const sheet = request.attendanceSheet;
  const isExcel =
    sheet.fileType === 'excel' ||
    sheet.fileName.endsWith('.xlsx') ||
    sheet.fileName.endsWith('.xls') ||
    sheet.fileName.endsWith('.csv');

  const count = sheet.attendeesCount || 45;

  const handleOpenOrDownload = async (mode: 'auto' | 'download_only' | 'view_only') => {
    try {
      await openOrDownloadAttendanceFile(sheet, request, mode);
      setDownloadSuccess(
        mode === 'download_only'
          ? 'تم بدء تنزيل الملف الأصلي بنجاح على جهازك'
          : isExcel
          ? 'تم تنزيل كشف الحضور بصيغة Excel'
          : 'تم فتح كشف الحضور بنجاح'
      );
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#c59b27]/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border ${
                isExcel
                  ? 'bg-emerald-600/30 border-emerald-400/40 text-emerald-300'
                  : 'bg-rose-600/30 border-rose-400/40 text-rose-300'
              }`}
            >
              {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <span>معاينة وتوثيق كشف الحضور المعتمد</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c59b27] text-slate-950 font-bold">
                  {isExcel ? 'ملف Excel' : 'ملف PDF'}
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/90">
                {request.name} • طلب #{request.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Original Attached File Card */}
          <div className="bg-gradient-to-br from-slate-50 via-amber-50/20 to-emerald-50/20 border-2 border-slate-200 hover:border-[#c59b27]/60 transition-colors rounded-2xl p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl shadow-xs border ${
                    isExcel
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
                >
                  {isExcel ? (
                    <FileSpreadsheet className="w-7 h-7" />
                  ) : (
                    <FileText className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      الملف الأصلي المرفق
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isExcel ? 'صيغة إكسل معتمدة' : 'وثيقة PDF معتمدة'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-mono dir-ltr text-right mt-1">
                    {sheet.fileName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    {sheet.fileSize && <span>الحجم: {sheet.fileSize}</span>}
                    <span>•</span>
                    <span>
                      تاريخ الرفع: {new Date(sheet.uploadedAt).toLocaleString('ar-SA')}
                    </span>
                    <span>•</span>
                    <span>بواسطة: {sheet.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {/* Direct File Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenOrDownload('auto')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] text-[#e6c566] hover:text-white text-xs font-extrabold shadow-sm hover:bg-[#143728] active:scale-95 transition-all cursor-pointer border border-[#c59b27]/30"
                >
                  <Eye className="w-3.5 h-3.5 text-[#e6c566]" />
                  <span>عرض / تحميل كشف الحضور</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenOrDownload('download_only')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-slate-300"
                  title="تنزيل الملف الأصلي على جهازك"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>تحميل</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">مقدم النشاط:</span>
                <span className="font-bold text-slate-800">{request.presenter}</span>
              </div>
              <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">الساعات التدريبية:</span>
                <span className="font-bold text-[#1b4332]">{request.hours} ساعات</span>
              </div>
              <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">إجمالي الحضور بالكشف:</span>
                <span className="font-bold text-emerald-800">{count} مستفيداً</span>
              </div>
              <div className="bg-white/95 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">حالة التوثيق:</span>
                <span className="font-bold text-[#c59b27]">
                  {request.status === 'uploaded_irtqaa'
                    ? 'موثق ومغلق رسمياً'
                    : 'بانتظار الاعتماد والإغلاق'}
                </span>
              </div>
            </div>

            {sheet.notes && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] bg-white/80 p-2.5 rounded-xl">
                <strong className="text-slate-700 block mb-0.5">ملاحظات منشئ الطلب المرفقة:</strong>
                <p className="text-slate-600 italic">{sheet.notes}</p>
              </div>
            )}
          </div>

          {/* Verification Matching Checklist */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>معايير المطابقة والتدقيق لمنصة ارتقاء (السجل المهاري)</span>
              </h5>
              <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                اعتماد مباشر على الملف الأصلي
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-emerald-100 text-emerald-900 font-medium shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>مطابقة الهويات والأرقام الجامعية بالكشف</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-emerald-100 text-emerald-900 font-medium shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>استيفاء الساعات المعتمدة ({request.hours} ساعات)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-emerald-100 text-emerald-900 font-medium shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>اعتماد رئيس الكلية ومطابقة النشاط</span>
              </div>
            </div>

            <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/80 text-[11px] text-slate-700 space-y-1">
              <div className="font-bold text-[#1b4332] flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>آلية التوثيق والاعتماد لمسؤول منصة ارتقاء (ناصر العصيمي):</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                يتم التحقق من بيانات الحضور مباشرة من واقع الملف المرفق المعتمد (Excel أو PDF) والضغط على زر «عرض/تحميل كشف الحضور»، ثم الضغط أدناه على زر «اعتماد التوثيق وإغلاق الطلب رسمياً» لإتمام كافة الإجراءات.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 sm:p-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            إغلاق النافذة
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isUploaderRole && request.status !== 'uploaded_irtqaa' && onReturnRequest && (
              <button
                type="button"
                onClick={() => {
                  onReturnRequest(request.id);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all border border-rose-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
                <span>إعادة الطلب لمنشئ النشاط</span>
              </button>
            )}

            {isUploaderRole && request.status !== 'uploaded_irtqaa' && onApproveAndClose && (
              <button
                type="button"
                onClick={() => {
                  onApproveAndClose(request.id);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] hover:text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#c59b27]/40"
              >
                <CheckCircle2 className="w-4 h-4 text-[#e6c566]" />
                <span>اعتماد التوثيق وإغلاق الطلب رسمياً</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
