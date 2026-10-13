import React, { useState } from 'react';
import { ActivityRequest, RequestStatus } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AttendancePreviewModal } from './AttendancePreviewModal';
import { StatusBadge } from './StatusBadge';
import { isActivityEnded } from '../utils/activityUtils';
import {
  ClipboardCheck,
  Check,
  CornerUpLeft,
  Calendar,
  Clock,
  MapPin,
  Globe,
  UserCheck,
  ExternalLink,
  Building2,
  Send,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  FileSearch,
  ShieldCheck,
  CloudUpload,
  AlertCircle,
  FileText,
  FileCheck,
  Lock,
  Eye,
} from 'lucide-react';

import { WorkflowStepper } from './WorkflowStepper';
import { MediaPublishBadge } from './MediaPublishBadge';

interface Props {
  requests: ActivityRequest[];
  onApprove: (id: number) => void;
  onReturnClick: (id: number) => void;
}

type TabType = 'pending' | 'referred' | 'returned';

export const ManagerView: React.FC<Props> = ({
  requests,
  onApprove,
  onReturnClick,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);
  const [previewSheetRequest, setPreviewSheetRequest] = useState<ActivityRequest | null>(null);

  // Filter requests by status categories
  const pendingRequests = requests.filter(
    (r) => r.status === 'pending_manager' || r.status === 'returned_manager'
  );

  const referredRequests = requests.filter(
    (r) =>
      r.status === 'pending_auditor' ||
      r.status === 'approved_final' ||
      r.status === 'uploaded_irtqaa'
  );

  const returnedRequests = requests.filter(
    (r) => r.status === 'returned_emp' || r.status === 'rejected'
  );

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* View Title & Context Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0 border border-[#1b4332]/20">
            <ClipboardCheck className="w-5 h-5 text-[#c59b27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                لوحة المدير المباشر
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#1b4332]">
                مراجعة واعتماد طلبات أنشطة الوحدة
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              اعتماد الأنشطة، التحقق من الجدوى، والإحالة لوحدة التدقيق والاعتماد الأكاديمي
            </p>
          </div>
        </div>
      </div>

      {/* Unified 4-Card KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">بانتظار موافقتي</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ClipboardCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{pendingRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">طلبات جديدة ومُعادة</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">محالة للتدقيق</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">{requests.filter((r) => r.status === 'pending_auditor').length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">قيد فحص الضوابط</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">معتمدة ومكتملة</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{requests.filter((r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">اعتماد نهائي وارتقاء</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">مسترجعة</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700 mt-1">{returnedRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">ملاحظات ومراجعات</div>
        </div>
      </div>

      {/* 1. Interactive Status Tabs (نظام التبويبات التفاعلي) */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        {/* Tab 1: بانتظار موافقتي */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="whitespace-nowrap">بانتظار موافقتي</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'pending'
                ? 'bg-[#c59b27] text-slate-950'
                : pendingRequests.length > 0
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {pendingRequests.length}
          </span>
        </button>

        {/* Tab 2: تمت إحالتها */}
        <button
          type="button"
          onClick={() => setActiveTab('referred')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'referred'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">تمت إحالتها</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'referred'
                ? 'bg-[#c59b27] text-slate-950'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {referredRequests.length}
          </span>
        </button>

        {/* Tab 3: مسترجعة / مرفوضة */}
        <button
          type="button"
          onClick={() => setActiveTab('returned')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'returned'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="whitespace-nowrap">مسترجعة</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'returned'
                ? 'bg-rose-400 text-slate-950'
                : returnedRequests.length > 0
                ? 'bg-rose-100 text-rose-900'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {returnedRequests.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: بانتظار موافقتي */}
      {activeTab === 'pending' && (
        <div className="space-y-3 animate-fade-slide-up">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-[#1b4332] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                لا توجد طلبات تنتظر موافقتك حالياً
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                تمت مراجعة واعتماد كافة طلبات الأنشطة المرفوعة من منسوبي الوحدة بنجاح.
              </p>
            </div>
          ) : (
            pendingRequests.map((r) => {
              const isReturnedFromAuditor = r.status === 'returned_manager';
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 border-r-[#c59b27]"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{r.name}</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {r.type}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>👤 مقدم الطلب: {r.presenter}</span>
                        {r.branch && (
                          <span className="text-slate-400">• {r.branch}</span>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                      <MediaPublishBadge request={r} />
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          isReturnedFromAuditor
                            ? 'bg-amber-50 text-amber-900 border border-amber-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isReturnedFromAuditor ? 'مُعاد من التدقيق' : 'بانتظار موافقتك'}
                      </span>
                    </div>
                  </div>

                  {isReturnedFromAuditor && r.note && (
                    <div className="mb-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                      <span className="font-bold flex items-center gap-1 mb-0.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>ملاحظة موظف التدقيق:</span>
                      </span>
                      <p className="leading-relaxed">{r.note}</p>
                    </div>
                  )}

                  {/* Key Metadata Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50/90 p-2.5 rounded-2xl mb-2.5 border border-slate-100">
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

                  <div className="bg-slate-50/80 p-2 rounded-xl text-[11px] text-slate-600 mb-3 italic border border-slate-100">
                    <span className="font-bold not-italic text-slate-700">الملخص: </span>
                    {r.summary || 'لا يوجد ملخص إضافي'}
                  </div>

                  {/* 3. Quick Details Action */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-3 py-1.5 rounded-xl border border-slate-200"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>عرض تفاصيل الطلب والتاريخ الإداري</span>
                    </button>
                    {r.transactionNumber && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        معاملة: {r.transactionNumber}
                      </span>
                    )}
                  </div>

                  {/* Primary Decision Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onApprove(r.id)}
                      className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#e6c566]" />
                      <span>اعتماد وتمرير للتدقيق</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReturnClick(r.id)}
                      className="flex-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-300 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                      <span>إرجاع بملاحظة</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT 2: تمت إحالتها (Referred / Previously Approved) */}
      {activeTab === 'referred' && (
        <div className="space-y-3 animate-fade-slide-up">
          {referredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Send className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                لا توجد طلبات مُحالة حالياً
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                فور اعتمادك لأي طلب نشاط، ستتم إحالته للتدقيق وسيظهر مساره الزمني هنا.
              </p>
            </div>
          ) : (
            referredRequests.map((r) => {
              const isFinal = r.status === 'approved_final';
              const isUploaded = r.status === 'uploaded_irtqaa';

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-r-4 transition hover:shadow-md ${
                    isUploaded
                      ? 'border-r-[#1b4332]'
                      : isFinal
                      ? 'border-r-emerald-500'
                      : 'border-r-amber-500'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{r.name}</span>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {r.type}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>👤 مقدم النشاط: {r.presenter}</span>
                        {r.branch && (
                          <span className="text-slate-400">• {r.branch}</span>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                      <MediaPublishBadge request={r} />
                      <StatusBadge status={r.status} note={r.note} />
                    </div>
                  </div>

                  {/* 2. Workflow Status Timeline (سجل سير العمل والتتبع - 5 خطوات) */}
                  <WorkflowStepper request={r} viewerRole="manager" />

                  {/* Key Metadata Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.startDate || r.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.hours} ساعات معتمدة</span>
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

                  {/* مرحلة كشف الحضور الختامية (الخطوة الأخيرة) */}
                  <div className="mb-3">
                    {!isActivityEnded(r) ? (
                      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-2 text-slate-600">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-400 shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-700">مرحلة كشف الحضور الختامية (الخطوة الأخيرة)</span>
                              <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                                غير مفعلة بعد
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              تتفعل هذه الخانة فور انتهاء فعاليات النشاط بتاريخ ({r.endDate || r.startDate || r.date})
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 hidden sm:inline-block font-mono">
                          موعد الانتهاء: {r.endDate || r.startDate}
                        </span>
                      </div>
                    ) : !r.attendanceSheet ? (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-amber-950">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                            <Clock className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">مرحلة كشف الحضور الختامية (الخطوة الأخيرة)</span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                النشاط منتهٍ • بانتظار الرفع
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">
                              انتهت فعاليات النشاط. بانتظار قيام مقدم النشاط برفع كشف الحضور المعتمد لتوثيق الساعات في السجل المهاري.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : r.attendanceSheet.status === 'approved' ? (
                      <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-emerald-950 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{r.attendanceSheet.fileName}</span>
                              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                                كشف معتمد وموثق رسمياً ✓
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-800 font-medium mt-0.5">
                              تم قبول واعتماد كشف الحضور ({r.attendanceSheet.attendeesCount || 35} حاضر) • المعاملة موثقة ومغلقة
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewSheetRequest(r)}
                          className="text-[11px] text-[#1b4332] bg-white hover:bg-emerald-100/50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#c59b27]" />
                          <span>معاينة كشف الحضور</span>
                        </button>
                      </div>
                    ) : r.attendanceSheet.status === 'returned' ? (
                      <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-rose-950 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{r.attendanceSheet.fileName}</span>
                              <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                                كشف الحضور مُعاد للموظف للتعديل
                              </span>
                            </div>
                            <p className="text-[10px] text-rose-800 mt-0.5">
                              ملاحظة مسؤول المنصة: {r.attendanceSheet.returnNote || 'مطلوب استيفاء وتعديل بيانات الكشف.'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewSheetRequest(r)}
                          className="text-[11px] text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>معاينة الكشف</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-amber-950 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                            <FileCheck className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{r.attendanceSheet.fileName}</span>
                              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                                كشف الحضور قيد التدقيق
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">
                              تم رفع الكشف ({r.attendanceSheet.attendeesCount || 35} حاضر) • بانتظار مراجعة واعتماد مسؤول الرفع لمنصة ارتقاء
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewSheetRequest(r)}
                          className="text-[11px] text-[#1b4332] bg-white hover:bg-amber-100/50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#c59b27]" />
                          <span>معاينة الكشف</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Administrative Note / Status Indicator */}
                  <div className="flex items-center justify-between bg-slate-50/70 p-2.5 rounded-xl text-[11px] text-slate-700 mb-3 border border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>قرارك كمدير: تمت الموافقة والإحالة للتدقيق والاعتماد.</span>
                    </span>
                    {r.coordinatorName && (
                      <span className="text-[10px] text-slate-500">
                        المنسق: {r.coordinatorName}
                      </span>
                    )}
                  </div>

                  {/* 3. Quick Details & Administrative History Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <FileSearch className="w-4 h-4 text-[#e6c566]" />
                      <span>عرض تفاصيل الطلب والتاريخ الإداري</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT 3: مسترجعة / مرفوضة */}
      {activeTab === 'returned' && (
        <div className="space-y-3 animate-fade-slide-up">
          {returnedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                سجل نظيف! لا توجد طلبات مسترجعة أو مرفوضة
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                الطلبات التي تُعاد للموظف لاستيفاء الملاحظات ستظهر في هذا التبويب مع كافة تفاصيل الملاحظات.
              </p>
            </div>
          ) : (
            returnedRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 border-r-rose-500"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>👤 مقدم الطلب: {r.presenter}</span>
                      {r.branch && <span className="text-slate-400">• {r.branch}</span>}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                    <MediaPublishBadge request={r} />
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                      مسترجع للموظف
                    </span>
                  </div>
                </div>

                {/* Reason / Return Note */}
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] text-rose-900">
                  <span className="font-bold block mb-0.5">سبب الإرجاع / الملاحظة:</span>
                  <p className="leading-relaxed">
                    {r.note || 'يرجى مراجعة وتحديث بعض بيانات النشاط قبل الاعتماد.'}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50/90 p-2.5 rounded-2xl mb-3 border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.startDate || r.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.hours} ساعات</span>
                  </span>
                  {r.unit && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.unit}</span>
                    </span>
                  )}
                </div>

                {/* View Details Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    <FileSearch className="w-4 h-4 text-slate-600" />
                    <span>عرض تفاصيل الطلب والتاريخ الإداري</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Full Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        viewerRole="manager"
      />

      {/* 4. Preview Attendance Sheet Modal */}
      <AttendancePreviewModal
        isOpen={Boolean(previewSheetRequest)}
        request={previewSheetRequest}
        onClose={() => setPreviewSheetRequest(null)}
      />
    </div>
  );
};
