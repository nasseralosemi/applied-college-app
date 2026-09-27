import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AttendancePreviewModal } from './AttendancePreviewModal';
import { ReturnAttendanceModal } from './ReturnAttendanceModal';
import { downloadAttendanceSheet, isActivityEnded } from '../utils/activityUtils';
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
  onConfirmUpload: (id: number) => void;
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

  const readyRequests = requests.filter(
    (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  );
  const pendingUploadRequests = requests.filter((r) => r.status === 'approved_final');
  const uploadedRequests = requests.filter((r) => r.status === 'uploaded_irtqaa');

  const displayedRequests =
    activeTab === 'ready'
      ? pendingUploadRequests
      : activeTab === 'uploaded'
      ? uploadedRequests
      : readyRequests;

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* Title Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              بوابة ارتقاء
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1b4332]">
              أخذ البيانات والرفع لمنصة ارتقاء الرسمية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مزامنة ساعات الأنشطة المعتمدة في السجل المهاري للجامعة وفق توجيهات التدقيق
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">الأنشطة المعتمدة</span>
            <span className="text-sm font-extrabold text-[#1b4332]">{readyRequests.length} نشاط</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shadow-md shadow-[#1b4332]/25">
            <CloudUpload className="w-5 h-5" />
          </div>
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

        {/* Tab 2: مرفوع على ارتقاء */}
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
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {uploadedRequests.length}
          </span>
        </button>

        {/* Tab 3: أرشيف الكل */}
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
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {readyRequests.length}
          </span>
        </button>
      </div>

      {/* Main Request List */}
      <div className="space-y-3">
        {displayedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <CloudUpload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1">
              {activeTab === 'ready'
                ? 'لا توجد طلبات معتمدة بانتظار الرفع حالياً'
                : activeTab === 'uploaded'
                ? 'لم يتم رفع أنشطة بعد'
                : 'لا توجد أنشطة متوفرة'}
            </p>
            <p className="text-[11px] text-slate-400">
              تظهر الأنشطة هنا فور استكمال اعتماد رئيس الكلية ولجنة الضوابط والتوجيه.
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
                  <StatusBadge status={r.status} note={r.note} />
                </div>

                {/* Directive & Dispatch Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 p-2.5 rounded-2xl text-[11px] mb-3 border border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span className="text-slate-500">المكلف بالرفع:</span>
                    <strong className="text-slate-900">
                      {r.assignedUploader || 'موظف الرفع العام لمنصة ارتقاء'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span className="text-slate-500">النشر الإعلامي (X):</span>
                    {r.xPlatformPublish ? (
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="bg-slate-900 text-white text-[9px] font-mono px-1 rounded">X</span>
                        <span>مطلوب إعلان رسمي</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                        بدون إعلان (سجل مهاري فقط)
                      </span>
                    )}
                  </div>

                  {r.deanApproved && (
                    <div className="col-span-full pt-1 flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold border-t border-slate-200/60">
                      <Award className="w-3 h-3 text-emerald-700" />
                      <span>معتمد إدارياً ورسمياً من سعادة رئيس الكلية</span>
                      {r.deanApprovalDate && (
                        <span className="text-slate-500 font-normal">({r.deanApprovalDate})</span>
                      )}
                    </div>
                  )}

                  {r.uploaderInstructions && (
                    <div className="col-span-full pt-1 border-t border-slate-200/60 text-[10px] text-slate-700 bg-white/70 p-2 rounded-xl">
                      <strong className="text-[#1b4332] block mb-0.5">تعليمات وإرشادات المدقق:</strong>
                      <p className="leading-relaxed">{r.uploaderInstructions}</p>
                    </div>
                  )}
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
                    onClick={() => onConfirmUpload(r.id)}
                    className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
                  >
                    <CloudUpload className="w-4 h-4 text-[#e6c566]" />
                    <span>تأكيد الرفع والمزامنة في منصة ارتقاء (سجل مهاري)</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Primary Irtqaa Upload Success Banner */}
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 p-2.5 rounded-2xl text-xs font-bold border border-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>تم توثيق الساعات في منصة ارتقاء بنجاح</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
                        سجل رقم #{r.id}-IRTQ
                      </span>
                    </div>

                    {/* مرحلة كشف الحضور الختامية (منصة ارتقاء) */}
                    <div className="bg-slate-50/90 border-2 border-slate-200 rounded-3xl p-3.5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
                            <FileCheck2 className="w-4 h-4 text-[#c59b27]" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-[#1b4332]">
                              مرحلة كشف الحضور الختامية (منصة ارتقاء)
                            </h5>
                            <p className="text-[10px] text-slate-500">
                              تدقيق واعتماد الكشف النهائي أو الإعادة للموظف
                            </p>
                          </div>
                        </div>

                        {r.attendanceSheet?.status === 'approved' || r.isOfficiallyClosed ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>معتمد ومغلق رسمياً</span>
                          </span>
                        ) : r.attendanceSheet?.status === 'returned' ? (
                          <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-2.5 py-1 rounded-full border border-rose-300 flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-rose-600" />
                            <span>مُعاد للموظف للتعديل</span>
                          </span>
                        ) : r.attendanceSheet ? (
                          <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
                            مرفق وبانتظار الإجراء
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-full">
                            بانتظار الرفع من الموظف
                          </span>
                        )}
                      </div>

                      {/* Display attached attendance sheet info & preview/download buttons */}
                      {r.attendanceSheet ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                                <FileText className="w-4 h-4 text-emerald-700" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px] sm:max-w-xs">
                                  {r.attendanceSheet.fileName}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  الحجم: {r.attendanceSheet.fileSize || '1.2 MB'} • المسجلون: {r.attendanceSheet.attendeesCount || 35} متدرب
                                </span>
                              </div>
                            </div>

                            {/* زر معاينة / تحميل الملف */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewModalRequest(r)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] rounded-xl text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-[#c59b27]/30"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>معاينة الملف</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => downloadAttendanceSheet(r)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 shadow-xs active:scale-95 transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                <span>تحميل الملف</span>
                              </button>
                            </div>
                          </div>

                          {/* Approval or Return Status or Action Buttons */}
                          {r.attendanceSheet.status === 'approved' || r.isOfficiallyClosed ? (
                            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-2xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                                <div>
                                  <span className="font-extrabold block">تم قبول واعتماد كشف الحضور رسمياً</span>
                                  <span className="text-[10px] text-emerald-800">
                                    تم توثيق النشاط وإغلاق المعاملة رسمياً في سجلات منصة ارتقاء.
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-lg font-mono">
                                مغلق رسمياً
                              </span>
                            </div>
                          ) : r.attendanceSheet.status === 'returned' ? (
                            <div className="bg-rose-50 border border-rose-300 text-rose-950 p-3 rounded-2xl space-y-1.5 text-xs">
                              <div className="flex items-center justify-between font-bold text-rose-900">
                                <span className="flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>تمت إعادة هذا الكشف للموظف مع الملاحظات التالية:</span>
                                </span>
                                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md">
                                  بانتظار الكشف المحدث
                                </span>
                              </div>
                              <p className="bg-white/95 p-2 rounded-xl border border-rose-200 text-slate-800 text-[11px] leading-relaxed">
                                {r.attendanceSheet.returnNote}
                              </p>
                              <div className="pt-1 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => setReturnModalRequest(r)}
                                  className="text-[10px] text-rose-800 hover:underline font-bold"
                                >
                                  تحديث ملاحظات الإعادة
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* خياري التعامل مع الكشف */
                            <div className="pt-1 space-y-2">
                              <span className="text-[11px] font-bold text-slate-700 block">
                                خيارات التعامل مع الكشف:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {/* خيار 1: قبول واعتماد الكشف */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onApproveAttendance) {
                                      onApproveAttendance(r.id);
                                    }
                                  }}
                                  className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer border border-emerald-600"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                                  <div className="text-right">
                                    <span className="block leading-tight">قبول واعتماد الكشف</span>
                                    <span className="text-[9px] text-emerald-200 block font-normal">
                                      لتوثيق النشاط وإغلاق المعاملة رسمياً
                                    </span>
                                  </div>
                                </button>

                                {/* خيار 2: إعادة للموظف */}
                                <button
                                  type="button"
                                  onClick={() => setReturnModalRequest(r)}
                                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border-2 border-rose-300"
                                >
                                  <RotateCcw className="w-4 h-4 text-rose-600" />
                                  <div className="text-right">
                                    <span className="block leading-tight">إعادة للموظف</span>
                                    <span className="text-[9px] text-rose-700 block font-normal">
                                      تحديد ملاحظات وسبب الإعادة (إجباري)
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* لم يقم الموظف برفع الكشف بعد */
                        <div className="p-3 bg-slate-100/90 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                          <Info className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>
                            {isActivityEnded(r)
                              ? 'النشاط منتهي • بانتظار قيام مقدم النشاط (الموظف) برفع كشف الحضور الختامي للاعتماد والتوثيق.'
                              : `النشاط قيد التنفيذ • تتفعل خانة رفع كشف الحضور للموظف فور انتهاء النشاط بتاريخ (${r.endDate || r.startDate}).`}
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
    </div>
  );
};
