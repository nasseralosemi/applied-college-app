import React, { useState } from 'react';
import { ActivityRequest, RequestStatus } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { StatusBadge } from './StatusBadge';
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
} from 'lucide-react';

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

  // Workflow timeline renderer for referred requests
  const renderWorkflowTimeline = (status: RequestStatus) => {
    // Milestones:
    // 1: مقدم الطلب (Submitted)
    // 2: المدير المباشر (Manager Approval)
    // 3: التدقيق والاعتماد (Auditor / Dean)
    // 4: منصة ارتقاء (Irtqaa Upload)

    const isStage1Done = true; // submitted
    const isStage2Done = true; // manager already approved
    const isStage3Done = status === 'approved_final' || status === 'uploaded_irtqaa';
    const isStage3Active = status === 'pending_auditor';
    const isStage4Done = status === 'uploaded_irtqaa';
    const isStage4Active = status === 'approved_final';

    let summaryText = 'تمت موافقتك ← قيد التدقيق لدى المراجع';
    let summaryStyle = 'bg-amber-50 text-amber-900 border-amber-200/90';

    if (status === 'approved_final') {
      summaryText = 'معتمدة نهائياً ← جاهزة للرفع لمنصة ارتقاء';
      summaryStyle = 'bg-emerald-50 text-emerald-900 border-emerald-200/90';
    } else if (status === 'uploaded_irtqaa') {
      summaryText = 'مكتملة ومرفوعة بنجاح على منصة ارتقاء';
      summaryStyle = 'bg-[#1b4332]/10 text-[#1b4332] border-[#1b4332]/20';
    }

    return (
      <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 mb-3 space-y-2.5">
        {/* Timeline Status Chip */}
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${summaryStyle}`}
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status === 'uploaded_irtqaa'
                    ? 'bg-emerald-400'
                    : status === 'approved_final'
                    ? 'bg-emerald-500'
                    : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  status === 'uploaded_irtqaa'
                    ? 'bg-emerald-600'
                    : status === 'approved_final'
                    ? 'bg-emerald-600'
                    : 'bg-amber-500'
                }`}
              />
            </span>
            <span>المرحلة الحالية: {summaryText}</span>
          </div>
          <ArrowLeft className="w-3.5 h-3.5 opacity-60" />
        </div>

        {/* Visual Stepper / Timeline */}
        <div className="pt-1">
          <div className="relative flex items-center justify-between">
            {/* Background connecting bar */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0" />

            {/* Active connecting bar */}
            <div
              className={`absolute top-1/2 right-4 -translate-y-1/2 h-1 transition-all duration-300 z-0 ${
                isStage4Done
                  ? 'w-[calc(100%-2rem)] bg-emerald-600'
                  : isStage3Done
                  ? 'w-[70%] bg-emerald-500'
                  : 'w-[35%] bg-[#1b4332]'
              }`}
            />

            {/* Step 1: Submitter */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-medium text-slate-700 mt-1 whitespace-nowrap">
                تم الرفع
              </span>
            </div>

            {/* Step 2: Direct Manager */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1b4332] text-[#e6c566] flex items-center justify-center text-[10px] font-bold shadow-xs ring-2 ring-emerald-100">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold text-[#1b4332] mt-1 whitespace-nowrap">
                موافقتك ✓
              </span>
            </div>

            {/* Step 3: Auditor / College */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                  isStage3Done
                    ? 'bg-emerald-600 text-white'
                    : isStage3Active
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStage3Done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isStage3Active ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  '3'
                )}
              </div>
              <span
                className={`text-[9px] mt-1 whitespace-nowrap ${
                  isStage3Active
                    ? 'font-bold text-amber-800'
                    : isStage3Done
                    ? 'font-medium text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                التدقيق والاعتماد
              </span>
            </div>

            {/* Step 4: Irtqaa Platform */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                  isStage4Done
                    ? 'bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]'
                    : isStage4Active
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStage4Done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isStage4Active ? (
                  <CloudUpload className="w-3 h-3" />
                ) : (
                  '4'
                )}
              </div>
              <span
                className={`text-[9px] mt-1 whitespace-nowrap ${
                  isStage4Done
                    ? 'font-bold text-[#1b4332]'
                    : isStage4Active
                    ? 'font-bold text-emerald-800'
                    : 'text-slate-400'
                }`}
              >
                منصة ارتقاء
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif]">
      {/* View Title & Subtitle */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
            <ClipboardCheck className="w-4 h-4 text-[#c59b27]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#1b4332] leading-tight">
              لوحة تحكم المدير المباشر
            </h2>
            <p className="text-[10px] text-slate-500">
              اعتماد الأنشطة، تتبع مسارات التدقيق، والاطلاع على السجل الإداري
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
          إجمالي: {requests.length}
        </span>
      </div>

      {/* 1. Interactive Status Tabs (نظام التبويبات التفاعلي) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        {/* Tab 1: بانتظار موافقتي */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="whitespace-nowrap">بانتظار موافقتي</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'pending'
                ? 'bg-amber-400 text-slate-900'
                : pendingRequests.length > 0
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {pendingRequests.length}
          </span>
        </button>

        {/* Tab 2: تمت إحالتها */}
        <button
          type="button"
          onClick={() => setActiveTab('referred')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'referred'
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">تمت إحالتها</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'referred'
                ? 'bg-[#c59b27] text-slate-900'
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
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'returned'
              ? 'bg-[#1b4332] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="whitespace-nowrap">مسترجعة / مرفوضة</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'returned'
                ? 'bg-rose-400 text-slate-900'
                : returnedRequests.length > 0
                ? 'bg-rose-100 text-rose-900'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {returnedRequests.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: بانتظار موافقتي */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
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
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-r-4 border-r-[#c59b27] hover:shadow-md transition"
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
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-2.5">
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

                  <div className="bg-slate-50/70 p-2 rounded-lg text-[11px] text-slate-600 mb-3 italic">
                    <span className="font-bold not-italic text-slate-700">الملخص: </span>
                    {r.summary || 'لا يوجد ملخص إضافي'}
                  </div>

                  {/* 3. Quick Details Action */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 transition cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-2.5 py-1.5 rounded-lg border border-slate-200"
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
                      className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#e6c566]" />
                      <span>اعتماد وتمرير للتدقيق</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReturnClick(r.id)}
                      className="flex-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-300 transition cursor-pointer"
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
        <div className="space-y-3">
          {referredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
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
                    <StatusBadge status={r.status} note={r.note} />
                  </div>

                  {/* 2. Workflow Status Timeline (سجل سير العمل والتتبع) */}
                  {renderWorkflowTimeline(r.status)}

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
                      className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
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
        <div className="space-y-3">
          {returnedRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
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
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-r-4 border-r-rose-500 hover:shadow-md transition"
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
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    مسترجع للموظف
                  </span>
                </div>

                {/* Reason / Return Note */}
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900">
                  <span className="font-bold block mb-0.5">سبب الإرجاع / الملاحظة:</span>
                  <p className="leading-relaxed">
                    {r.note || 'يرجى مراجعة وتحديث بعض بيانات النشاط قبل الاعتماد.'}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
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
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
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
      />
    </div>
  );
};
