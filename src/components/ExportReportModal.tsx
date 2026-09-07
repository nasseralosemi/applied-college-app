import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import {
  Download,
  FileSpreadsheet,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requests: ActivityRequest[];
}

export const ExportReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  requests,
}) => {
  const [format, setFormat] = useState<'excel' | 'pdf'>('excel');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const total = requests.length;
  const uploaded = requests.filter((r) => r.status === 'uploaded_irtqaa').length;
  const approved = requests.filter((r) => r.status === 'approved_final').length;
  const pendingAuditor = requests.filter((r) => r.status === 'pending_auditor').length;
  const pendingManager = requests.filter((r) => r.status === 'pending_manager').length;
  const returned = requests.filter((r) => r.status === 'returned_emp' || r.status === 'returned_manager').length;

  const getStatusArabicLabel = (status: string) => {
    switch (status) {
      case 'uploaded_irtqaa':
        return 'موثق في منصة ارتقاء';
      case 'approved_final':
        return 'معتمد وجاهز للرفع';
      case 'pending_auditor':
        return 'بانتظار تدقيق الكلية';
      case 'pending_manager':
        return 'بانتظار موافقة المدير المباشر';
      case 'returned_emp':
        return 'مسترجع لمقدم الطلب';
      case 'returned_manager':
        return 'مسترجع للمدير المباشر';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'رقم النشاط',
      'رقم المعاملة',
      'مسمى النشاط',
      'نوع النشاط',
      'الجهة المقدمة',
      'الوحدة المشرفة',
      'الفرع',
      'تاريخ البداية',
      'تاريخ النهاية',
      'وقت البداية',
      'الساعات التدريبية',
      'الفئة المستهدفة',
      'حالة التنفيذ',
      'المقر أو الرابط',
      'حالة الاعتماد',
      'اعتماد رئيس الكلية',
      'الموظف المكلف بالرفع',
      'مطلوب نشر في منصة X',
      'توجيهات التدقيق',
    ];

    const rows = requests.map((r) => [
      `"${r.id}"`,
      `"${r.transactionNumber || '-'}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.type || '-'}"`,
      `"${(r.presenter || '').replace(/"/g, '""')}"`,
      `"${(r.unit || '').replace(/"/g, '""')}"`,
      `"${(r.branch || '').replace(/"/g, '""')}"`,
      `"${r.startDate || r.date || '-'}"`,
      `"${r.endDate || r.date || '-'}"`,
      `"${r.startTime || '-'}"`,
      `"${r.hours || '-'}"`,
      `"${(r.targetAudience || '').replace(/"/g, '""')}"`,
      `"${r.deliveryMode || '-'}"`,
      `"${(r.deliveryMode === 'عن بعد' ? r.meetingUrl : r.physicalLocation || r.location || '').replace(/"/g, '""')}"`,
      `"${getStatusArabicLabel(r.status)}"`,
      `"${r.deanApproved ? 'معتمد رسمياً' : 'قيد التدقيق'}"`,
      `"${(r.assignedUploader || 'الموظف العام').replace(/"/g, '""')}"`,
      `"${r.xPlatformPublish ? 'نعم - مطلوب إعلان' : 'لا'}"`,
      `"${(r.uploaderInstructions || r.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_سير_عمل_الأنشطة_الكلية_التطبيقية_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl border border-slate-100 text-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center font-bold shadow-md shadow-[#1b4332]/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1b4332]">
                تصدير التقرير النهائي لسير العمل
              </h3>
              <p className="text-[11px] text-slate-500">
                توليد تقرير رسمي شامل بحالة كافة أنشطة وساعات الكلية التطبيقية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFormat('excel')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              format === 'excel'
                ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#c59b27]" />
            <span>تقرير إكسل متكامل (Excel / CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              format === 'pdf'
                ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Printer className="w-4 h-4 text-[#c59b27]" />
            <span>طباعة التقرير / حفظ PDF</span>
          </button>
        </div>

        {/* Statistics Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 text-right">
            <span className="text-[10px] text-slate-400 block font-bold">إجمالي الأنشطة</span>
            <span className="text-base font-extrabold text-[#1b4332]">{total} نشاط</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200/70 text-right">
            <span className="text-[10px] text-emerald-700 block font-bold">موثقة بارتقاء</span>
            <span className="text-base font-extrabold text-emerald-800">{uploaded} نشاط</span>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200/70 text-right">
            <span className="text-[10px] text-amber-700 block font-bold">معتمدة للتوجيه</span>
            <span className="text-base font-extrabold text-amber-900">{approved} نشاط</span>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200/70 text-right">
            <span className="text-[10px] text-purple-700 block font-bold">قيد التدقيق</span>
            <span className="text-base font-extrabold text-purple-900">
              {pendingAuditor + pendingManager} نشاط
            </span>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>تم توليد وتنزيل ملف Excel (.CSV) المرمّز باللغة العربية بنجاح!</span>
          </div>
        )}

        {/* Format Specific Details */}
        {format === 'excel' ? (
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 mb-4 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-[#1b4332] font-bold">
              <FileSpreadsheet className="w-4 h-4 text-[#c59b27]" />
              <span>محتويات ملف Excel المصدّر:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 pr-2">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>أرقام المعاملات وسجلات الأنشطة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>الجهات المقدمة والوحدات والفروع</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>عدد الساعات ومواعيد وتواريخ الانعقاد</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>حالة اعتماد رئيس الكلية والمدقق</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>الموظف المكلف بالرفع لمنصة ارتقاء</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]" />
                <span>حالة طلب النشر الإعلامي عبر منصة X</span>
              </li>
            </ul>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
              * تم ضبط تشفير الملف بترميز UTF-8 مع خاصية BOM لفتح النصوص العربية مباشرة وبشكل سليم في برنامج Microsoft Excel.
            </p>
          </div>
        ) : (
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 mb-4 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-[#1b4332] font-bold">
              <Printer className="w-4 h-4 text-[#c59b27]" />
              <span>معاينة الطباعة وتصدير PDF:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              سيتم فتح نافذة الطباعة الرسمية، ويمكنك اختيار <strong>"حفظ بتنسيق PDF" (Save as PDF)</strong> من قائمة الطابعات لحفظ التقرير بصيغة مستند رسمي يحمل ترويسة جامعة المجمعة والكلية التطبيقية.
            </p>
          </div>
        )}

        {/* Printable Section (hidden visually on screen, active in print) */}
        <div id="printable-report" className="hidden print:block text-right p-4">
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
            <h1 className="text-xl font-black text-slate-900">المملكة العربية السعودية - جامعة المجمعة</h1>
            <h2 className="text-lg font-bold text-slate-700 mt-1">الكلية التطبيقية - التقرير الشامل لسير عمل الأنشطة المهارية</h2>
            <p className="text-xs text-slate-500 mt-1">
              تاريخ إصدار التقرير: {new Date().toLocaleDateString('ar-SA')} | إجمالي الأنشطة: {total}
            </p>
          </div>

          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 p-2">#</th>
                <th className="border border-slate-300 p-2">مسمى النشاط</th>
                <th className="border border-slate-300 p-2">النوع</th>
                <th className="border border-slate-300 p-2">الجهة المشرفة</th>
                <th className="border border-slate-300 p-2">الفرع</th>
                <th className="border border-slate-300 p-2">الساعات</th>
                <th className="border border-slate-300 p-2">الحالة الحالية</th>
                <th className="border border-slate-300 p-2">المكلف بالرفع</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, idx) => (
                <tr key={r.id}>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-bold">{r.name}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{r.type}</td>
                  <td className="border border-slate-300 p-1.5">{r.presenter}</td>
                  <td className="border border-slate-300 p-1.5">{r.branch || 'الكلية'}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{r.hours} س</td>
                  <td className="border border-slate-300 p-1.5 text-center">{getStatusArabicLabel(r.status)}</td>
                  <td className="border border-slate-300 p-1.5">{r.assignedUploader || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {format === 'excel' ? (
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex-1 bg-gradient-to-r from-[#1b4332] to-[#143728] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#1b4332]/25 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-[#e6c566]" />
              <span>تحميل ملف Excel (.CSV) الآن</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrintPDF}
              className="flex-1 bg-gradient-to-r from-[#1b4332] to-[#143728] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#1b4332]/25 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#e6c566]" />
              <span>فتح نافذة الطباعة / حفظ PDF</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
