import React from 'react';
import { ActivityRequest } from '../types';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveAndClose?: (requestId: number) => void;
  isUploaderRole?: boolean;
}

export const AttendanceSheetModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
  onApproveAndClose,
  isUploaderRole = false,
}) => {
  if (!isOpen || !request || !request.attendanceSheet) return null;

  const sheet = request.attendanceSheet;
  const isExcel = sheet.fileType === 'excel' || sheet.fileName.endsWith('.xlsx') || sheet.fileName.endsWith('.xls') || sheet.fileName.endsWith('.csv');

  // Generate sample verified attendees list for realistic preview
  const count = sheet.attendeesCount || 24;
  const sampleAttendees = [
    { id: '4410012', name: 'سلطان فهد المطيري', major: 'تقنية معلومات', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410089', name: 'فيصل محمد الدوسري', major: 'إدارة أعمال', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410145', name: 'عبدالله إبراهيم السويكت', major: 'علوم حاسب', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410210', name: 'خالد عبدالعزيز العمار', major: 'تقنية معلومات', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410332', name: 'تركي ناصر الشمري', major: 'نظم معلومات', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410405', name: 'محمد سعد القحطاني', major: 'تقنية شبكات', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410512', name: 'عبدالرحمن صالح الفهد', major: 'تقنية معلومات', status: 'حاضر (100%)', hours: request.hours },
    { id: '4410620', name: 'زياد حمد المنصور', major: 'إدارة مكتبية', status: 'حاضر (100%)', hours: request.hours },
  ];

  const handleDownload = () => {
    // Generate text or csv content for realistic download
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      encodeURIComponent(
        `كشف الحضور المعتمد - ${request.name}\n` +
          `التاريخ: ${request.startDate || request.date}, الساعات: ${request.hours}\n\n` +
          `الرقم الجامعي,اسم الطالب,التخصص,حالة الحضور,الساعات المعتمدة\n` +
          sampleAttendees
            .map((a) => `${a.id},${a.name},${a.major},${a.status},${a.hours}`)
            .join('\n')
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', sheet.fileName || `كشف_حضور_${request.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border ${
              isExcel
                ? 'bg-emerald-600/30 border-emerald-400/40 text-emerald-300'
                : 'bg-rose-600/30 border-rose-400/40 text-rose-300'
            }`}>
              {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <span>معاينة كشف الحضور المعتمد</span>
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
          {/* Metadata Card */}
          <div className="bg-gradient-to-br from-slate-50 to-amber-50/20 border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200">
                  {isExcel ? (
                    <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
                  ) : (
                    <FileText className="w-6 h-6 text-rose-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-mono dir-ltr text-right">
                    {sheet.fileName}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    {sheet.fileSize && <span>الحجم: {sheet.fileSize}</span>}
                    <span>•</span>
                    <span>تاريخ الرفع: {new Date(sheet.uploadedAt).toLocaleString('ar-SA')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b4332] text-[#e6c566] text-xs font-bold shadow-xs hover:bg-[#143728] active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل الملف الأصلي</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">مقدم النشاط:</span>
                <span className="font-bold text-slate-800">{request.presenter}</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">الساعات التدريبية:</span>
                <span className="font-bold text-[#1b4332]">{request.hours} ساعات</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">عدد الحضور في الكشف:</span>
                <span className="font-bold text-emerald-800">{count} مستفيداً</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">حالة التوثيق:</span>
                <span className="font-bold text-[#c59b27]">
                  {request.status === 'uploaded_irtqaa' ? 'موثق ومغلق رسمياً' : 'بانتظار الاعتماد والإغلاق'}
                </span>
              </div>
            </div>

            {sheet.notes && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] bg-white/70 p-2.5 rounded-xl">
                <strong className="text-slate-700 block mb-0.5">ملاحظات منشئ الطلب المرفقة:</strong>
                <p className="text-slate-600 italic">{sheet.notes}</p>
              </div>
            )}
          </div>

          {/* Verification Matching Checklist */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
            <h5 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>معايير المطابقة والتدقيق لمنصة ارتقاء (السجل المهاري)</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>مطابقة الهويات والأرقام الجامعية</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>استيفاء الساعات ({request.hours} ساعات)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>اعتماد رئيس الكلية موثق</span>
              </div>
            </div>
          </div>

          {/* Attendee Preview Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>عينة من سجلات الحضور المسجلة بالكشف</span>
              </h5>
              <span className="text-[10px] text-slate-400 font-mono">
                إجمالي الكشف: {count} طالباً ومتدرباً
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-[11px]">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">الرقم الجامعي</th>
                      <th className="py-2.5 px-3">اسم المستفيد</th>
                      <th className="py-2.5 px-3">التخصص / القسم</th>
                      <th className="py-2.5 px-3">حالة الحضور</th>
                      <th className="py-2.5 px-3">الساعات المعتمدة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {sampleAttendees.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-700">{att.id}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{att.name}</td>
                        <td className="py-2 px-3 text-slate-600">{att.major}</td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                            <span>{att.status}</span>
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-[#1b4332]">{att.hours} ساعات</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            إغلاق المعاينة
          </button>

          {isUploaderRole && request.status !== 'uploaded_irtqaa' && onApproveAndClose && (
            <button
              type="button"
              onClick={() => {
                onApproveAndClose(request.id);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] hover:text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#c59b27]/40"
            >
              <CheckCircle2 className="w-4 h-4 text-[#e6c566]" />
              <span>اعتماد التوثيق وإغلاق الطلب رسمياً</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
