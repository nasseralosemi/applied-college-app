import React, { useState } from 'react';
import { ActivityRequest, AccreditationDocument } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AttendancePreviewModal } from './AttendancePreviewModal';
import { ReturnAttendanceModal } from './ReturnAttendanceModal';
import { IrtqaaAccreditationModal } from './IrtqaaAccreditationModal';
import { AccreditationPreviewModal } from './AccreditationPreviewModal';
import { WorkflowStepper } from './WorkflowStepper';
import { MediaPublishBadge } from './MediaPublishBadge';
import { downloadAttendanceSheet, isActivityEnded, downloadAccreditationDocument } from '../utils/activityUtils';
import {
  CloudUpload,
  CloudCheck,
  Calendar,
  Clock,
  MapPin,
  Globe,
  CheckCircle,
  ExternalLink,
  Building2,
  CheckCheck,
  Layers,
  FileSearch,
  UserCheck,
  Share2,
  Award,
  AlertCircle,
  Info,
  Eye,
  Download,
  RotateCcw,
  FileCheck2,
  Lock,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onConfirmUpload: (id: number, document?: AccreditationDocument) => void;
  onApproveAttendance?: (id: number) => void;
  onReturnAttendance?: (id: number, note: string) => void;
}

export const UploaderView: React.FC<Props> = ({
  requests,
  onConfirmUpload,
  onApproveAttendance,
  onReturnAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'ready' | 'uploaded' | 'all'>('ready');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);
  const [returnModalRequest, setReturnModalRequest] = useState<ActivityRequest | null>(null);
  const [previewModalRequest, setPreviewModalRequest] = useState<ActivityRequest | null>(null);
  const [accreditationUploadRequest, setAccreditationUploadRequest] = useState<ActivityRequest | null>(null);
  const [accreditationPreviewRequest, setAccreditationPreviewRequest] = useState<ActivityRequest | null>(null);

  // Helper to check if attendance sheet stage is officially approved & documented
  const isAttendanceDocumented = (r: ActivityRequest) =>
    r.attendanceSheet?.status === 'approved' || Boolean(r.isOfficiallyClosed);

  // Tab 1: جاهز للرفع (المعتمدة نهائياً وبانتظار الرفع لمنصة ارتقاء)
  const pendingUploadRequests = requests.filter((r) => r.status === 'approved_final');

  // Tab 2: مرفوعة (المعاملات المرفوعة على ارتقاء والتي تنتظر رفع أو اعتماد كشف الحضور والغياب الختامي)
  const uploadedAwaitingAttendance = requests.filter(
    (r) => r.status === 'uploaded_irtqaa' && !isAttendanceDocumented(r)
  );

  // Tab 3: السجل الكامل (المعاملات المكتملة والموثقة نهائياً بعد اعتماد كشف الحضور)
  const completedDocumentedRequests = requests.filter(
    (r) => r.status === 'uploaded_irtqaa' && isAttendanceDocumented(r)
  );

  const displayedRequests =
    activeTab === 'ready'
      ? pendingUploadRequests
      : activeTab === 'uploaded'
      ? uploadedAwaitingAttendance
      : completedDocumentedRequests;

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* Title Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0 border border-[#1b4332]/20">
            <CloudUpload className="w-5 h-5 text-[#c59b27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
                بوابة ارتقاء
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#1b4332]">
                أخذ البيانات والرفع لمنصة ارتقاء الرسمية
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مزامنة ساعات الأنشطة المعتمدة في السجل المهاري للجامعة وفق توجيهات التدقيق
            </p>
          </div>
        </div>
      </div>

      {/* Unified 4-Card KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">جاهز للرفع</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CloudUpload className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{pendingUploadRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">بانتظار الإدخال لارتقاء</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">مرفوعة (تنتظر الكشف)</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CloudCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{uploadedAwaitingAttendance.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">تنتظر كشف الحضور والغياب</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">السجل الكامل</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{completedDocumentedRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">كشف حضور معتمد ومغلق</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">إجمالي الأنشطة</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{requests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">كافة مسارات المنظومة</div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        {/* Tab 1: جاهز للرفع */}
        <button
          type="button"
          onClick={() => setActiveTab('ready')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'ready'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <CloudUpload className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">جاهز للرفع</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'ready'
                ? 'bg-[#c59b27] text-slate-950'
                : pendingUploadRequests.length > 0
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {pendingUploadRequests.length}
          </span>
        </button>

        {/* Tab 2: مرفوعة (المعاملات التي تنتظر رفع كشف الحضور والغياب الختامي) */}
        <button
          type="button"
          onClick={() => setActiveTab('uploaded')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'uploaded'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <CloudCheck className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">مرفوعة</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'uploaded'
                ? 'bg-[#c59b27] text-slate-950'
                : uploadedAwaitingAttendance.length > 0
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {uploadedAwaitingAttendance.length}
          </span>
        </button>

        {/* Tab 3: السجل الكامل (فقط بعد رفع كشف الحضور المعتمد واكتمال التوثيق نهائياً) */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">السجل الكامل</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'all'
                ? 'bg-[#c59b27] text-slate-950'
                : completedDocumentedRequests.length > 0
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {completedDocumentedRequests.length}
          </span>
        </button>
      </div>

      {/* Main Request List */}
      <div className="space-y-3">
        {displayedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
              {activeTab === 'ready' ? (
                <CloudUpload className="w-6 h-6 text-amber-600" />
              ) : activeTab === 'uploaded' ? (
                <FileCheck2 className="w-6 h-6 text-[#1b4332]" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1">
              {activeTab === 'ready'
                ? 'لا توجد طلبات معتمدة بانتظار الرفع حالياً'
                : activeTab === 'uploaded'
                ? 'لا توجد معاملات مرفوعة تنتظر كشف الحضور والغياب حالياً'
                : 'لا توجد معاملات مكتملة في السجل الكامل بعد'}
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              {activeTab === 'ready'
                ? 'تظهر الأنشطة هنا فور استكمال اعتماد رئيس الكلية ولجنة التدقيق.'
                : activeTab === 'uploaded'
                ? 'المعاملات المرفوعة لمنصة ارتقاء التي تنتظر رفع أو تدقيق كشف الحضور والغياب ستبقى ضمن هذا التبويب حتى اكتمال التوثيق.'
                : 'تنتقل المعاملة إلى السجل الكامل تلقائياً فور رفع كشف الحضور المعتمد واكتمال مرحلة التوثيق نهائياً.'}
            </p>
          </div>
        ) : (
          displayedRequests.map((r) => {
            const isUploaded = r.status === 'uploaded_irtqaa';
            return (
              <div
                key={r.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 ${
                  isUploaded ? 'border-r-[#1b4332]' : 'border-r-emerald-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>الجهة: {r.presenter}</span>
                      {r.branch && <span className="text-slate-400">• {r.branch}</span>}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                    <MediaPublishBadge request={r} />
                    <StatusBadge status={r.status} note={r.note} />
                  </div>
                </div>

                {/* Stepper شريط متابعة مراحل المعاملة الزمني */}
                <WorkflowStepper request={r} viewerRole="uploader" />

                {/* Directive & Dispatch Info Bar (مختصر وغير مزدحم) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-2xl text-[11px] mb-3 border border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span className="text-slate-500">المكلف بالرفع:</span>
                    <strong className="text-slate-900 truncate">
                      {r.assignedUploader || 'موظف الرفع العام لمنصة ارتقاء'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span className="text-slate-500">حالة النشر الإعلامي:</span>
                    <MediaPublishBadge request={r} />
                  </div>
                </div>

                {/* Field Badges */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50/90 p-2.5 rounded-2xl mb-3 border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.startDate || r.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.hours} ساعات تدريبية</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {r.deliveryMode === 'عن بعد' ? (
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                    )}
                    <span>
                      {r.deliveryMode === 'عن بعد'
                        ? 'عن بعد'
                        : r.physicalLocation || r.location || 'حضوري'}
                    </span>
                  </span>
                  {r.unit && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.unit}</span>
                    </span>
                  )}
                </div>

                {/* View Details Link */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-3 py-1.5 rounded-xl border border-slate-200"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>عرض الاستمارة ومطابقة كشف الحضور</span>
                  </button>

                  {r.transactionNumber && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      معاملة: {r.transactionNumber}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {!isUploaded ? (
                  <button
                    type="button"
                    onClick={() => setAccreditationUploadRequest(r)}
                    className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/20 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
                  >
                    <CloudUpload className="w-4 h-4 text-[#e6c566]" />
                    <span>تأكيد الرفع والمزامنة في منصة ارتقاء (إرفاق نموذج الاعتماد)</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Unified Accreditation Info (بدون تكرار الصناديق الخضراء) */}
                    <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <CheckCheck className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-950">
                              تم التوثيق في منصة ارتقاء
                            </span>
                            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-mono px-1.5 py-0.5 rounded font-bold">
                              {r.accreditationDocument?.accreditationNumber || `IRTQ-${r.id}`}
                            </span>
                          </div>
                          {r.accreditationDocument && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              ملف الاعتماد: {r.accreditationDocument.fileName}
                            </p>
                          )}
                        </div>
                      </div>

                      {r.accreditationDocument && (
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setAccreditationPreviewRequest(r)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#1b4332] text-[#e6c566] text-xs font-bold flex items-center gap-1 hover:bg-[#143728] active:scale-95 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة النموذج</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              r.accreditationDocument &&
                              downloadAccreditationDocument(r.accreditationDocument, r.name)
                            }
                            className="p-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100 text-emerald-900 transition active:scale-95 cursor-pointer"
                            title="تحميل صورة نموذج الاعتماد المطبوع"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* مرحلة كشف الحضور الختامية (منصة ارتقاء) */}
                    <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-3 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
                            <FileCheck2 className="w-3.5 h-3.5 text-[#c59b27]" />
                          </div>
                          <h5 className="text-xs font-bold text-[#1b4332]">
                            كشف الحضور والغياب الختامي
                          </h5>
                        </div>

                        {r.attendanceSheet?.status === 'approved' || r.isOfficiallyClosed ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>معتمد ومغلق رسمياً</span>
                          </span>
                        ) : r.attendanceSheet?.status === 'returned' ? (
                          <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-rose-600" />
                            <span>مُعاد للتعديل</span>
                          </span>
                        ) : r.attendanceSheet ? (
                          <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                            مرفق وبانتظار الإجراء
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                            بانتظار الرفع من الموظف
                          </span>
                        )}
                      </div>

                      {/* Display attached attendance sheet info & preview/download buttons */}
                      {r.attendanceSheet ? (
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                                <FileText className="w-4 h-4 text-emerald-700" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px] sm:max-w-xs">
                                  {r.attendanceSheet.fileName}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {r.attendanceSheet.fileSize || '1.2 MB'} • المسجلون: {r.attendanceSheet.attendeesCount || 35} متدرب
                                </span>
                              </div>
                            </div>

                            {/* زر معاينة / تحميل الملف */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewModalRequest(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] rounded-xl text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-[#c59b27]/30"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>معاينة</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => downloadAttendanceSheet(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 shadow-xs active:scale-95 transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>تحميل</span>
                              </button>
                            </div>
                          </div>

                          {/* Approval or Return Status or Action Buttons */}
                          {r.attendanceSheet.status === 'approved' || r.isOfficiallyClosed ? (
                            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-2.5 rounded-xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span className="font-bold">تم اعتماد كشف الحضور وإغلاق المعاملة رسمياً</span>
                              </div>
                              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-md font-mono">
                                مغلق رسمياً
                              </span>
                            </div>
                          ) : r.attendanceSheet.status === 'returned' ? (
                            <div className="bg-rose-50 border border-rose-200 text-rose-950 p-2.5 rounded-xl space-y-1.5 text-xs">
                              <div className="flex items-center justify-between font-bold text-rose-900">
                                <span className="flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>ملاحظة الإعادة للموظف:</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReturnModalRequest(r)}
                                  className="text-[10px] text-rose-800 hover:underline font-bold"
                                >
                                  تعديل الملاحظة
                                </button>
                              </div>
                              <p className="bg-white/95 p-2 rounded-lg border border-rose-200 text-slate-800 text-[11px] leading-relaxed">
                                {r.attendanceSheet.returnNote}
                              </p>
                            </div>
                          ) : (
                            /* خياري التعامل مع الكشف */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                              {/* خيار 1: قبول واعتماد الكشف */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (onApproveAttendance) {
                                    onApproveAttendance(r.id);
                                  }
                                }}
                                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer border border-emerald-600"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-200" />
                                <span>قبول واعتماد الكشف الختامي</span>
                              </button>

                              {/* خيار 2: إعادة للموظف */}
                              <button
                                type="button"
                                onClick={() => setReturnModalRequest(r)}
                                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-rose-200"
                              >
                                <RotateCcw className="w-4 h-4 text-rose-600" />
                                <span>إعادة للموظف للتعديل</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* لم يقم الموظف برفع الكشف بعد */
                        <div className="p-2.5 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>
                            {isActivityEnded(r)
                              ? 'النشاط منتهي • بانتظار رفع كشف الحضور من مقدم الطلب.'
                              : 'النشاط قيد التنفيذ • سيتم رفع الكشف من مقدم الطلب فور انتهاء النشاط.'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        viewerRole="uploader"
      />

      {/* Preview Attendance Sheet Modal */}
      <AttendancePreviewModal
        isOpen={Boolean(previewModalRequest)}
        request={previewModalRequest}
        onClose={() => setPreviewModalRequest(null)}
      />

      {/* Return Attendance Sheet to Employee Modal */}
      <ReturnAttendanceModal
        isOpen={Boolean(returnModalRequest)}
        request={returnModalRequest}
        onConfirm={(note) => {
          if (returnModalRequest && onReturnAttendance) {
            onReturnAttendance(returnModalRequest.id, note);
          }
          setReturnModalRequest(null);
        }}
        onCancel={() => setReturnModalRequest(null)}
      />

      {/* Mandatory Printed Accreditation Form Upload Modal */}
      <IrtqaaAccreditationModal
        isOpen={Boolean(accreditationUploadRequest)}
        request={accreditationUploadRequest}
        onClose={() => setAccreditationUploadRequest(null)}
        onConfirm={(requestId, document) => {
          onConfirmUpload(requestId, document);
          setAccreditationUploadRequest(null);
        }}
      />

      {/* Preview Printed Accreditation Form Modal */}
      <AccreditationPreviewModal
        isOpen={Boolean(accreditationPreviewRequest)}
        request={accreditationPreviewRequest}
        onClose={() => setAccreditationPreviewRequest(null)}
      />
    </div>
  );
};
