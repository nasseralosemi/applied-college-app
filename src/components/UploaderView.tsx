import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AttendanceSheetModal } from './AttendanceSheetModal';
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
  FileSpreadsheet,
  FileText,
  Eye,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onConfirmUpload: (id: number) => void;
  onApproveAndClose?: (id: number) => void;
}

export const UploaderView: React.FC<Props> = ({
  requests,
  onConfirmUpload,
  onApproveAndClose,
}) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'closed' | 'pending_sheet' | 'all'>('incoming');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);
  const [selectedAttendanceRequest, setSelectedAttendanceRequest] = useState<ActivityRequest | null>(null);

  // Filter requests
  const incomingAttendanceRequests = requests.filter((r) => r.status === 'attendance_submitted');
  const closedRequests = requests.filter((r) => r.status === 'uploaded_irtqaa');
  const pendingSheetRequests = requests.filter((r) => r.status === 'approved_final');
  const allRelatedRequests = requests.filter(
    (r) => r.status === 'attendance_submitted' || r.status === 'uploaded_irtqaa' || r.status === 'approved_final'
  );

  const displayedRequests =
    activeTab === 'incoming'
      ? incomingAttendanceRequests
      : activeTab === 'closed'
      ? closedRequests
      : activeTab === 'pending_sheet'
      ? pendingSheetRequests
      : allRelatedRequests;

  const handleApproveAction = (id: number) => {
    if (onApproveAndClose) {
      onApproveAndClose(id);
    } else {
      onConfirmUpload(id);
    }
  };

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* Title Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              بوابة ارتقاء الرسمية
            </span>
            <span className="text-[10px] font-mono bg-[#1b4332] text-[#e6c566] px-2 py-0.5 rounded-full font-bold">
              المسؤول: ناصر العصيمي
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1b4332]">
              توثيق السجل المهاري واعتماد إغلاق المعاملات
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مراجعة ومطابقة كشوفات الحضور المعتمدة المرفوعة من منشئي الطلبات وإغلاق المعاملات في منصة ارتقاء
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">كشوفات واردة للتوثيق</span>
            <span className="text-sm font-extrabold text-amber-700">{incomingAttendanceRequests.length} كشف بانتظارك</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shadow-md shadow-[#1b4332]/25">
            <CloudUpload className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        {/* Tab 1: وارد كشوفات الحضور للتوثيق */}
        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'incoming'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">وارد كشوف الحضور</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'incoming'
                ? 'bg-[#c59b27] text-slate-950'
                : incomingAttendanceRequests.length > 0
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {incomingAttendanceRequests.length}
          </span>
        </button>

        {/* Tab 2: المعاملات المعتمدة والمغلقة رسمياً */}
        <button
          type="button"
          onClick={() => setActiveTab('closed')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'closed'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <CloudCheck className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">معتمدة ومغلقة</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'closed'
                ? 'bg-[#c59b27] text-slate-950'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {closedRequests.length}
          </span>
        </button>

        {/* Tab 3: أنشطة بانتظار رفع كشف الحضور */}
        <button
          type="button"
          onClick={() => setActiveTab('pending_sheet')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'pending_sheet'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">بانتظار الكشف</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'pending_sheet'
                ? 'bg-[#c59b27] text-slate-950'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {pendingSheetRequests.length}
          </span>
        </button>

        {/* Tab 4: السجل الكامل */}
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
            {allRelatedRequests.length}
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
              {activeTab === 'incoming'
                ? 'لا توجد كشوفات حضور واردة بانتظار الاعتماد حالياً'
                : activeTab === 'closed'
                ? 'لا توجد معاملات مغلقة بعد'
                : activeTab === 'pending_sheet'
                ? 'لا توجد أنشطة بانتظار رفع كشف الحضور'
                : 'لا توجد طلبات متوفرة'}
            </p>
            <p className="text-[11px] text-slate-400">
              {activeTab === 'incoming'
                ? 'تتحول الطلبات تلقائياً إلى هذا القسم فور قيام منشئ الطلب بإرفاق كشف الحضور المعتمد والضغط على إرسال.'
                : 'يتم تحديث القوائم آلياً فور تفاعل المستخدمين والمسؤولين.'}
            </p>
          </div>
        ) : (
          displayedRequests.map((r) => {
            const isClosed = r.status === 'uploaded_irtqaa';
            const isIncoming = r.status === 'attendance_submitted';

            return (
              <div
                key={r.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 ${
                  isClosed
                    ? 'border-r-[#1b4332]'
                    : isIncoming
                    ? 'border-r-amber-500 ring-1 ring-amber-400/40'
                    : 'border-r-emerald-500'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>منشئ ومقدم النشاط: <strong className="text-slate-700">{r.presenter}</strong></span>
                      {r.branch && <span className="text-slate-400">• {r.branch}</span>}
                    </p>
                  </div>
                  <StatusBadge status={r.status} note={r.note} />
                </div>

                {/* Directive & Dispatch Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 p-2.5 rounded-2xl text-[11px] mb-3 border border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span className="text-slate-500">مسؤول التوثيق (ارتقاء):</span>
                    <strong className="text-slate-900">
                      ناصر العصيمي
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-slate-500">حالة الاعتماد الإداري:</span>
                    <span className="font-bold text-emerald-800">
                      معتمد رسمياً من سعادة رئيس الكلية
                    </span>
                  </div>

                  {r.uploaderInstructions && (
                    <div className="col-span-full pt-1 border-t border-slate-200/60 text-[10px] text-slate-700 bg-white/70 p-2 rounded-xl">
                      <strong className="text-[#1b4332] block mb-0.5">تعليمات وتوجيهات التدقيق:</strong>
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

                {/* ATTACHED ATTENDANCE SHEET SECTION (When submitted or closed) */}
                {r.attendanceSheet && (
                  <div className={`p-3.5 rounded-2xl mb-3 border ${
                    isClosed
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/80 border-amber-300 shadow-xs'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        {r.attendanceSheet.fileType === 'excel' ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 text-xs block font-mono dir-ltr text-right">
                            {r.attendanceSheet.fileName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            الحجم: {r.attendanceSheet.fileSize} • تاريخ الرفع: {new Date(r.attendanceSheet.uploadedAt).toLocaleString('ar-SA')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {r.attendanceSheet.attendeesCount} حضور بالكشف
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedAttendanceRequest(r)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold px-3 py-1.5 bg-white hover:bg-amber-50 rounded-xl border border-slate-300 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#c59b27]" />
                          <span>معاينة ومطابقة الكشف</span>
                        </button>
                      </div>
                    </div>

                    {r.attendanceSheet.notes && (
                      <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-200/70 mb-2">
                        <strong className="text-slate-800">ملاحظات المنشئ المرفقة:</strong> {r.attendanceSheet.notes}
                      </p>
                    )}

                    {/* Verification Checklist */}
                    {!isClosed && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/80 text-[10px] space-y-1">
                        <div className="font-bold text-[#1b4332] flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>قائمة التدقيق والمطابقة لمسؤول التوثيق (ناصر العصيمي):</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-slate-700">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>تطابق أسماء وبيانات الحضور</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>استيفاء الساعات ({r.hours} ساعات)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>المزامنة مع السجل المهاري</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* If approved_final without attendance sheet */}
                {r.status === 'approved_final' && !r.attendanceSheet && (
                  <div className="bg-amber-50/70 border border-amber-200 text-amber-950 p-3 rounded-2xl text-xs mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      الطلب معتمد إدارياً، وبانتظار قيام منشئ الطلب ({r.presenter}) بإرفاق كشف الحضور المعتمد بعد انتهاء الفعالية ليتحول آلياً لحسابك.
                    </span>
                  </div>
                )}

                {/* View Details Link */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-3 py-1.5 rounded-xl border border-slate-200"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>عرض الاستمارة الأصلية والتاريخ الإداري</span>
                  </button>

                  {r.transactionNumber && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      معاملة: {r.transactionNumber}
                    </span>
                  )}
                </div>

                {/* Primary Action Button */}
                {isIncoming && (
                  <button
                    type="button"
                    onClick={() => handleApproveAction(r.id)}
                    className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] hover:text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#e6c566]" />
                    <span>اعتماد التوثيق وإغلاق الطلب</span>
                  </button>
                )}

                {isClosed && (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 p-2.5 rounded-2xl text-xs font-bold border border-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>تم توثيق كشف الحضور وإغلاق الطلب رسمياً في منصة ارتقاء</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
                      سجل موثق #{r.id}-IRTQ
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      {/* Attendance Sheet Modal with Matching Checklist */}
      <AttendanceSheetModal
        request={selectedAttendanceRequest}
        isOpen={!!selectedAttendanceRequest}
        onClose={() => setSelectedAttendanceRequest(null)}
        isUploaderRole={true}
        onApproveAndClose={handleApproveAction}
      />
    </div>
  );
};
