import React, { useState, useMemo } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AccreditationPreviewModal } from './AccreditationPreviewModal';
import { StatusBadge } from './StatusBadge';
import {
  downloadAccreditationDocument,
  generateAccreditationSampleImage,
} from '../utils/activityUtils';
import {
  Award,
  ShieldCheck,
  FileCheck2,
  Clock,
  Building2,
  Calendar,
  Search,
  Eye,
  Download,
  FileSpreadsheet,
  Globe,
  MapPin,
  CheckCircle2,
  Layers,
  FileImage,
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
}

export const AccreditationView: React.FC<Props> = ({ requests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [activeRequestDetails, setActiveRequestDetails] = useState<ActivityRequest | null>(null);
  const [previewingAccreditationRequest, setPreviewingAccreditationRequest] = useState<ActivityRequest | null>(null);

  // Filter only activities uploaded to Irtqaa (Archived and Accredited)
  const accreditedActivities = useMemo(() => {
    return requests.filter((r) => r.status === 'uploaded_irtqaa');
  }, [requests]);

  // Statistics
  const totalAccredited = accreditedActivities.length;
  const withAccreditationDoc = accreditedActivities.filter((r) => r.accreditationDocument).length;
  const totalHours = accreditedActivities.reduce(
    (sum, r) => sum + (parseFloat(String(r.hours)) || 0),
    0
  );
  const documentationRate =
    totalAccredited > 0 ? Math.round((withAccreditationDoc / totalAccredited) * 100) : 100;

  // Filtered List
  const filteredActivities = useMemo(() => {
    return accreditedActivities.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.presenter.toLowerCase().includes(q) ||
        (r.accreditationDocument?.accreditationNumber &&
          r.accreditationDocument.accreditationNumber.toLowerCase().includes(q)) ||
        (r.transactionNumber && r.transactionNumber.toLowerCase().includes(q));

      const matchesBranch = selectedBranch === 'all' || r.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    });
  }, [accreditedActivities, searchQuery, selectedBranch]);

  const branches = useMemo(() => {
    return Array.from(new Set(accreditedActivities.map((r) => r.branch).filter(Boolean)));
  }, [accreditedActivities]);

  const handleExportArchive = () => {
    const csvHeader = 'رقم المعاملة,اسم النشاط,نوع النشاط,المقدم,الفرع,الساعات التدريبية,رقم الاعتماد بمنصة ارتقاء,اسم ملف النموذج المطبوع,تاريخ الرفع والمزامنة\n';
    const csvRows = filteredActivities.map((r) => {
      const accNum = r.accreditationDocument?.accreditationNumber || `IRTQ-${r.id}`;
      const docName = r.accreditationDocument?.fileName || 'نموذج_اعتماد_ارتقاء_مطبوع.pdf';
      const uploadDate = r.accreditationDocument?.uploadedAt
        ? new Date(r.accreditationDocument.uploadedAt).toLocaleDateString('ar-SA')
        : '2026-09-10';

      return `"${r.id}","${r.name}","${r.type}","${r.presenter}","${r.branch || 'المقر الرئيسي'}","${r.hours}","${accNum}","${docName}","${uploadDate}"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + csvHeader + csvRows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `أرشيف_نماذج_الاعتماد_ارتقاء_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif] text-right">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-l from-[#1b4332] via-[#143728] to-[#081c15] text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-[#1b4332] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2.5 h-full bg-[#c59b27]" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c59b27] via-[#dfb13c] to-[#e6c566] text-[#081c15] flex items-center justify-center font-bold shadow-md shrink-0 border border-[#e6c566]/60">
              <Award className="w-6 h-6 text-[#081c15]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  صفحة الاعتمادات والتوثيق - أ. بيان الطيار
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c59b27]/25 text-[#e6c566] border border-[#c59b27]/40">
                  نماذج الاعتماد المعتمدة
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                الأرشيف الرسمي المعتمد والمكتمل لنماذج الاعتماد المطبوعة والمرفوعة عبر منصة ارتقاء بجامعة المجمعة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportArchive}
            className="px-3 py-2 rounded-xl bg-[#c59b27] hover:bg-[#d4ab37] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer self-end sm:self-center"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-950" />
            <span>تصدير سجل نماذج الاعتماد (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">الأنشطة المعتمدة في ارتقاء</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalAccredited}</div>
          <div className="text-[10px] text-emerald-800 font-medium mt-0.5">
            سجل مهاري وطني موثق
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">نماذج الاعتماد المطبوعة</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">{withAccreditationDoc}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            نماذج مطبوعة ومزامنة
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">الساعات التدريبية المعتمدة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1">
            {totalHours} <span className="text-xs font-normal text-slate-400">ساعة</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            إجمالي الساعات المسجلة
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">معدل اكتمال التوثيق</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{documentationRate}%</div>
          <div className="text-[10px] text-emerald-800 mt-0.5 font-bold">
            جاهزية أرشيف النماذج
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم النشاط، مقدم النشاط، رقم الاعتماد أو المعاملة..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b4332] bg-slate-50/70"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1b4332] text-slate-700 font-medium"
            >
              <option value="all">جميع الفروع ({accreditedActivities.length})</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Activities Archive List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">لا توجد سجلات مطابقة للبحث</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              تأكد من شروط البحث أو قم بإلغاء التصفية لعرض جميع نماذج الأنشطة المعتمدة في أرشيف بيان الطيار.
            </p>
          </div>
        ) : (
          filteredActivities.map((req) => {
            const doc = req.accreditationDocument;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all border-r-4 border-r-[#1b4332] space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#1b4332] text-[#e6c566] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        #{req.id}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {req.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {req.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>الجهة: {req.presenter}</span>
                      </span>
                      {req.branch && (
                        <span className="text-slate-400">• {req.branch}</span>
                      )}
                      {req.transactionNumber && (
                        <span className="text-slate-400">• معاملة: {req.transactionNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>معتمد في منصة ارتقاء</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveRequestDetails(req)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                      title="عرض كامل بيانات الاستمارة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.startDate || req.date}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.hours} ساعات معتمدة</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {req.deliveryMode === 'عن بعد' ? (
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                    )}
                    <span>{req.deliveryMode}</span>
                  </span>
                  {req.coordinatorName && (
                    <span className="text-slate-500">
                      • المنسق: {req.coordinatorName}
                    </span>
                  )}
                </div>

                {/* Sole Document Section: نموذج الاعتماد المطبوع من منصة ارتقاء */}
                <div className="bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">
                          نموذج الاعتماد المطبوع من منصة ارتقاء بالجامعة
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          النسخة الرسمية المعتمدة والمطابقة لمعايير السجل المهاري
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-mono px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                      {doc?.accreditationNumber || `IRTQ-${req.id}`}
                    </span>
                  </div>

                  {/* Image Thumbnail and Details Grid */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/90 p-3 rounded-xl border border-emerald-100">
                    {/* Visual Image Thumbnail */}
                    <div
                      onClick={() => setPreviewingAccreditationRequest(req)}
                      className="w-full sm:w-28 h-28 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group relative hover:opacity-90 transition shadow-2xs"
                      title="انقر لتكبير ومعاينة الصورة"
                    >
                      <img
                        src={
                          doc?.fileUrl ||
                          generateAccreditationSampleImage(
                            req.name,
                            doc?.accreditationNumber || `IRTQ-2026-${req.id}`,
                            doc?.uploadedBy || req.assignedUploader || 'ناصر العصيمي',
                            req.hours,
                            req.startDate || req.date,
                            req.branch
                          )
                        }
                        alt="صورة نموذج الاعتماد"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>تكبير</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 w-full space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">اسم ملف الصورة:</span>
                        <strong className="text-[10px] text-slate-800 font-mono truncate max-w-[200px] sm:max-w-xs">
                          {doc?.fileName || `صورة_نموذج_اعتماد_${req.name.replace(/\s+/g, '_')}.png`}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>الموظف المكلف بالرفع: <strong className="text-slate-700">{doc?.uploadedBy || req.assignedUploader || 'ناصر العصيمي'}</strong></span>
                        <span className="font-mono">{doc?.fileSize || '2.1 MB'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>تاريخ الرفع والمزامنة:</span>
                        <span className="font-mono text-slate-700 font-bold">
                          {doc?.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ar-SA') : '2026-09-10'}
                        </span>
                      </div>

                      {doc?.notes && (
                        <div className="text-[10px] text-emerald-950 bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200 mt-1">
                          <span className="font-bold">ملاحظات التوثيق: </span>
                          <span>{doc.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview / Direct Download Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-emerald-100/80">
                    <button
                      type="button"
                      onClick={() => setPreviewingAccreditationRequest(req)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1b4332] text-[#e6c566] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#143728] active:scale-95 transition cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة وتكبير صورة الاعتماد</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const finalDoc = doc || {
                          fileName: `صورة_نموذج_اعتماد_${req.name.replace(/\s+/g, '_')}.png`,
                          accreditationNumber: `IRTQ-2026-${req.id}`,
                          uploadedBy: req.assignedUploader || 'ناصر العصيمي',
                        };
                        downloadAccreditationDocument(finalDoc, req.name);
                      }}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#c59b27] via-[#dfb13c] to-[#e6c566] text-slate-950 text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs hover:brightness-105"
                      title="تحميل الصورة مباشرة إلى جهازك"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>تحميل الصورة للجهاز</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {activeRequestDetails && (
        <RequestDetailsModal
          request={activeRequestDetails}
          onClose={() => setActiveRequestDetails(null)}
        />
      )}

      {/* Accreditation Preview Modal */}
      {previewingAccreditationRequest && (
        <AccreditationPreviewModal
          isOpen={true}
          request={previewingAccreditationRequest}
          onClose={() => setPreviewingAccreditationRequest(null)}
        />
      )}
    </div>
  );
};
