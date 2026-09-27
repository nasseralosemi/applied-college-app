import React, { useState } from 'react';
import { ActivityRequest, AttendanceFile } from '../types';
import { downloadAttendanceFile } from '../utils/attendanceUtils';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  Printer,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: ActivityRequest | null;
  file?: AttendanceFile;
}

export const AttendanceViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  request,
  file: customFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !request) return null;

  const file = customFile || request.attendanceFile;
  if (!file) return null;

  const isExcel = file.fileType === 'excel' || file.fileName.endsWith('.xlsx') || file.fileName.endsWith('.xls');
  const isPdf = file.fileType === 'pdf' || file.fileName.endsWith('.pdf');

  const records = file.sampleRecords || [];
  const filteredRecords = records.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.includes(searchTerm) ||
      r.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const success = downloadAttendanceFile(file);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
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
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                isExcel
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isExcel ? (
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileText className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c59b27] text-slate-950">
                  {isExcel ? 'ملف Excel' : isPdf ? 'مستند PDF' : 'كشف حضور'}
                </span>
                <span className="text-[10px] text-emerald-200/90 font-mono">
                  {file.fileSize}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                {file.fileName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {/* Activity Info Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <div>
                <span className="text-[10px] text-slate-500 block font-bold">النشاط المرتبط بالكشف:</span>
                <h4 className="text-sm font-bold text-slate-900">{request.name}</h4>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 font-mono text-[10px]">
                  #{request.id}
                </span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  {request.hours} ساعات معتمدة
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">المقدم / الجهة:</span>
                <span className="font-semibold text-slate-800">{request.presenter}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ التنفيذ:</span>
                <span className="font-semibold text-slate-800">{request.startDate || request.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ رفع الكشف:</span>
                <span className="font-semibold text-slate-800">{file.uploadedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">حالة التوثيق:</span>
                <span className="font-bold text-[#1b4332]">
                  {request.status === 'uploaded_irtqaa'
                    ? 'موثق ومعتمد بارتقاء'
                    : request.status === 'attendance_returned'
                    ? 'مُعاد للتعديل'
                    : 'قيد التدقيق'}
                </span>
              </div>
            </div>

            {file.notes && (
              <div className="mt-2 bg-white p-2.5 rounded-xl border border-slate-200/70 text-[11px] text-slate-700">
                <strong className="text-[#1b4332] block mb-0.5">ملاحظات مقدم النشاط:</strong>
                <p>{file.notes}</p>
              </div>
            )}

            {request.attendanceReturnReason && request.status === 'attendance_returned' && (
              <div className="mt-2 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[11px] text-rose-900">
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ملاحظات مسؤول الرفع (سبب الإعادة):</span>
                </div>
                <p>{request.attendanceReturnReason}</p>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-emerald-800 block font-bold">إجمالي المتدربين بالكشف</span>
              <span className="text-base font-extrabold text-emerald-950 font-mono">
                {records.length > 0 ? records.length : '18'} متدرب
              </span>
            </div>
            <div className="bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-amber-800 block font-bold">الساعات التدريبية</span>
              <span className="text-base font-extrabold text-amber-950 font-mono">
                {request.hours} ساعات
              </span>
            </div>
            <div className="bg-sky-50/70 border border-sky-200/80 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-sky-800 block font-bold">حالة التدقيق والمطابقة</span>
              <span className="text-xs font-bold text-sky-950 mt-1 block">
                {request.status === 'uploaded_irtqaa' ? 'معتمد رسمياً' : 'جاهز للمطابقة'}
              </span>
            </div>
          </div>

          {/* Table Header & Search */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <FileCheck className="w-4 h-4 text-[#c59b27]" />
                <span>بيانات الحضور المسجلة بالكشف ({filteredRecords.length})</span>
              </h5>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث بالاسم أو الرقم الجامعي..."
                  className="text-[11px] px-3 py-1.5 pr-8 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] outline-none w-full sm:w-56"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Attendees Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <div className="overflow-x-auto max-h-56 custom-scrollbar">
                <table className="w-full text-right border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                      <th className="p-2 w-10 text-center">#</th>
                      <th className="p-2">الرقم الجامعي</th>
                      <th className="p-2">اسم المتدرب / المشارك</th>
                      <th className="p-2">الكلية والتخصص</th>
                      <th className="p-2 text-center">الساعات</th>
                      <th className="p-2 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          لا توجد نتائج مطابقة للبحث
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r, idx) => (
                        <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="p-2 font-mono font-bold text-slate-800 text-[10px]">
                            {r.studentId}
                          </td>
                          <td className="p-2 font-medium text-slate-900">
                            {r.studentName}
                          </td>
                          <td className="p-2 text-slate-500">
                            {r.college}
                          </td>
                          <td className="p-2 text-center font-bold text-[#1b4332]">
                            {r.attendedHours} س
                          </td>
                          <td className="p-2 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                              <span>{r.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-3.5 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1b4332]" />
            <span>كشف معتمد ومطابق لضوابط التوثيق بمنصة ارتقاء</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>طباعة</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/25 hover:from-[#143728] hover:to-[#081c15] transition-all cursor-pointer active:scale-95 border border-[#c59b27]/30"
            >
              <Download className="w-3.5 h-3.5 text-[#e6c566]" />
              <span>{downloadSuccess ? 'تم التنزيل بنجاح!' : 'تحميل كشف الحضور الآن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
