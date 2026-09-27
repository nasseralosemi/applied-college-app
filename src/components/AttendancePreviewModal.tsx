import React from 'react';
import { ActivityRequest } from '../types';
import { SAMPLE_ATTENDEES, downloadAttendanceSheet } from '../utils/activityUtils';
import {
  X,
  FileCheck2,
  Download,
  Printer,
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttendancePreviewModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request || !request.attendanceSheet) return null;

  const sheet = request.attendanceSheet;
  const isApproved = sheet.status === 'approved';
  const isReturned = sheet.status === 'returned';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadAttendanceSheet(request);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#c59b27]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27]/50 flex items-center justify-center text-[#e6c566] shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                  معاينة كشف الحضور الختامي الرسمي
                </h3>
                <span className="text-[10px] bg-[#c59b27] text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  منصة ارتقاء
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                {request.name} • {request.branch || 'الكلية التطبيقية'}
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

        {/* Status Callout */}
        <div className="px-5 pt-4">
          {isApproved ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold">
                  كشف الحضور معتمد وموثق رسمياً • تم إغلاق المعاملة بنجاح
                </span>
              </div>
              {sheet.approvedAt && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-mono">
                  {new Date(sheet.approvedAt).toLocaleDateString('ar-SA')}
                </span>
              )}
            </div>
          ) : isReturned ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>تمت إعادة هذا الكشف للموظف مع طلب التعديل</span>
              </div>
              <p className="text-[11px] bg-white/80 p-2 rounded-xl border border-rose-100 mt-1 text-slate-700">
                <strong className="text-rose-900">ملاحظات التعديل: </strong>
                {sheet.returnNote || 'يرجى مراجعة وتحديث أسماء وأرقام الحضور وفق النموذج المعتمد.'}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold">
                  كشف الحضور مرفوع وقيد المراجعة والاعتماد لدى مسؤول الرفع (منصة ارتقاء)
                </span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg font-semibold">
                بانتظار الاعتماد
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Document Area */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {/* Official University Letterhead Preview Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            {/* Watermark / Digital Seal */}
            <div className="absolute top-4 left-4 pointer-events-none opacity-15">
              <div className="w-24 h-24 rounded-full border-4 border-[#1b4332] flex flex-col items-center justify-center rotate-12">
                <span className="text-[8px] font-bold text-[#1b4332]">جامعة المجمعة</span>
                <span className="text-[10px] font-extrabold text-[#1b4332]">معتمد ارتقاء</span>
                <span className="text-[8px] font-bold text-[#c59b27]">الكلية التطبيقية</span>
              </div>
            </div>

            {/* Header in doc */}
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1b4332]">المملكة العربية السعودية</h4>
                <p className="text-[10px] text-slate-500 font-semibold">جامعة المجمعة • الكلية التطبيقية</p>
                <p className="text-[10px] text-slate-400">وحدة التوثيق ومنصة ارتقاء الوطنية</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block">رقم النشاط / المعاملة:</span>
                <span className="text-xs font-mono font-bold text-[#1b4332]">
                  #{request.id} {request.transactionNumber ? `• ${request.transactionNumber}` : ''}
                </span>
              </div>
            </div>

            {/* Activity Info Summary Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">اسم الفعالية:</span>
                <strong className="text-slate-900 block truncate">{request.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">مقدم النشاط:</span>
                <strong className="text-slate-900 block truncate">{request.presenter}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ التنفيذ:</span>
                <strong className="text-slate-900 block">{request.startDate || request.date}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الساعات التدريبية:</span>
                <strong className="text-[#1b4332] block font-bold">{request.hours} ساعات معتمدة</strong>
              </div>
            </div>

            {/* Attached File Details Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[11px]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-bold text-slate-800 block">{sheet.fileName}</span>
                  <span className="text-[10px] text-slate-500">
                    الحجم: {sheet.fileSize || '1.2 MB'} • تاريخ الرفع: {new Date(sheet.uploadedAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold">
                  إجمالي الحضور: {sheet.attendeesCount || SAMPLE_ATTENDEES.length} متدرب
                </span>
              </div>
            </div>

            {/* Attendees Data Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>سجل الحضور المرصود للنشاط ({SAMPLE_ATTENDEES.length} مسجلين):</span>
                </h5>
                <span className="text-[10px] text-slate-400">مستوفون لضوابط السجل المهاري</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2 px-2.5 w-8 text-center">#</th>
                      <th className="py-2 px-2.5">اسم المتدرب / الطالب</th>
                      <th className="py-2 px-2.5">الرقم الجامعي</th>
                      <th className="py-2 px-2.5 hidden sm:table-cell">التخصص / القسم</th>
                      <th className="py-2 px-2.5">وقت الحضور</th>
                      <th className="py-2 px-2.5 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {SAMPLE_ATTENDEES.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-2.5 font-bold text-slate-900">{att.name}</td>
                        <td className="py-2 px-2.5 font-mono text-slate-600">{att.studentId}</td>
                        <td className="py-2 px-2.5 text-slate-600 hidden sm:table-cell">{att.major}</td>
                        <td className="py-2 px-2.5 text-slate-500 font-mono text-[10px]">{att.checkInTime}</td>
                        <td className="py-2 px-2.5 text-center">
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                            <span>{att.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Certification Signature Box */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">مقدم / منسق النشاط</span>
                <span className="font-bold text-slate-800 text-xs">{request.coordinatorName || request.presenter}</span>
                <p className="text-[9px] text-emerald-700 mt-1 font-semibold">✓ تم التوقيع والرفع إلكترونياً</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">مسؤول الرفع لمنصة ارتقاء</span>
                <span className="font-bold text-slate-800 text-xs">
                  {request.assignedUploader || 'وحدة التوثيق ومنصة ارتقاء'}
                </span>
                <p className="text-[9px] text-slate-500 mt-1">
                  {isApproved ? '✓ تم الاعتماد وإغلاق المعاملة' : 'بانتظار إجراء الاعتماد'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] text-xs font-bold shadow-md shadow-[#1b4332]/20 active:scale-95 transition-all cursor-pointer border border-[#c59b27]/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل كشف الحضور (الملف الرسمي)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>طباعة</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-2xl active:scale-95 transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
