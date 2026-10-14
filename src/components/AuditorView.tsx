import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { EditActivityModal } from './EditActivityModal';
import { DispatchApprovalModal } from './DispatchApprovalModal';
import { ReturnNoteModal } from './ReturnNoteModal';
import { WorkflowStepper } from './WorkflowStepper';
import { MediaPublishBadge } from './MediaPublishBadge';
import {
  Stamp,
  CheckCheck,
  Undo2,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Award,
  Building2,
  Send,
  RotateCcw,
  CheckCircle2,
  FileSearch,
  Edit3,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Layers,
} from 'lucide-react';

import { NavTabKey } from './BottomNav';

export interface AuditorApprovalPayload {
  requestId: number;
  assignedUploader: string;
  xPlatformPublish: boolean;
  uploaderInstructions: string;
}

interface Props {
  requests: ActivityRequest[];
  onUpdateRequest: (updated: ActivityRequest) => void;
  onDeanApprove: (id: number) => void;
  onFinalApproveWithDispatch: (payload: AuditorApprovalPayload) => void;
  onReturnClick: (id: number, targetRole: 'manager' | 'emp', note: string) => void;
  activeNavTab?: NavTabKey;
}

export const AuditorView: React.FC<Props> = ({
  requests,
  onUpdateRequest,
  onDeanApprove,
  onFinalApproveWithDispatch,
  onReturnClick,
  activeNavTab,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'returned'>('pending');

  React.useEffect(() => {
    if (activeNavTab === 'pending' || activeNavTab === 'approved' || activeNavTab === 'returned') {
      setActiveTab(activeNavTab);
    } else if (activeNavTab === 'activities' || activeNavTab === 'home') {
      setActiveTab('pending');
    }
  }, [activeNavTab]);

  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

  // Modals state
  const [editingRequest, setEditingRequest] = useState<ActivityRequest | null>(null);
  const [dispatchingRequest, setDispatchingRequest] = useState<ActivityRequest | null>(null);
  const [returningRequestId, setReturningRequestId] = useState<number | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending_auditor');
  const approvedRequests = requests.filter(
    (r) =>
      r.status === 'approved_final' ||
      r.status === 'uploaded_irtqaa'
  );
  const returnedRequests = requests.filter(
    (r) => r.status === 'returned_manager' || r.status === 'returned_emp'
  );
  const deanApprovedCount = requests.filter(
    (r) => r.deanApproved || r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  ).length;

  return (
    <div className="space-y-4 pb-12 font-['Tajawal',sans-serif] text-right">
      {/* Top Banner with Sage Green (#46523B) and Gold (#A08D52) */}
      <div className="bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(70,82,59,0.06)] border border-[#46523B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-b from-[#46523B] via-[#A08D52] to-[#46523B]" />
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#46523B]/10 text-[#46523B] flex items-center justify-center shrink-0 border border-[#46523B]/20 shadow-xs">
            <Stamp className="w-5 h-5 text-[#A08D52]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#46523B]/10 text-[#46523B] border border-[#46523B]/20">
                لوحة مدقق المنظومة والاعتماد
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#46523B]">
                تدقيق معايير الأنشطة والاعتماد الإداري
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مراجعة الاستمارات، توثيق اعتماد رئيس الكلية، ومتابعة النشر والرفع لمنصة ارتقاء
            </p>
          </div>
        </div>

        {/* Mini quick summary count badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#46523B] bg-[#FAF9F6] px-3 py-1.5 rounded-2xl border border-[#46523B]/10 self-start sm:self-auto">
          <Layers className="w-4 h-4 text-[#A08D52]" />
          <span>إجمالي المعاملات: {requests.length}</span>
        </div>
      </div>

      {/* iOS Widget-Style Interactive KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Widget 1: بانتظار التدقيق */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`text-right p-4 rounded-[32px] bg-white border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${
            activeTab === 'pending'
              ? 'border-[#A08D52] shadow-[0_8px_25px_rgba(160,141,82,0.18)] ring-2 ring-[#A08D52]/20'
              : 'border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] hover:shadow-md hover:border-[#46523B]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-500">بانتظار تدقيقي</span>
            <div className="w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-200/60 group-hover:scale-105 transition-transform">
              <Stamp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#46523B] tracking-tight">
            {pendingRequests.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="text-amber-800 font-bold">قيد فحص الضوابط</span>
            <span className="text-[#A08D52] font-black group-hover:translate-x-[-2px] transition-transform">عرض ←</span>
          </div>
        </button>

        {/* Widget 2: معتمدة للرفع */}
        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`text-right p-4 rounded-[32px] bg-white border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${
            activeTab === 'approved'
              ? 'border-[#46523B] shadow-[0_8px_25px_rgba(70,82,59,0.18)] ring-2 ring-[#46523B]/20'
              : 'border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] hover:shadow-md hover:border-[#46523B]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-500">معتمدة للرفع</span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-200/60 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#46523B] tracking-tight">
            {approvedRequests.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="text-emerald-800 font-bold">جاهزة أو رُفعت لارتقاء</span>
            <span className="text-[#46523B] font-black group-hover:translate-x-[-2px] transition-transform">عرض ←</span>
          </div>
        </button>

        {/* Widget 3: اعتماد رئيس الكلية */}
        <div className="p-4 rounded-[32px] bg-white border border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-500">اعتماد رئيس الكلية</span>
            <div className="w-8 h-8 rounded-2xl bg-[#A08D52]/15 text-[#A08D52] flex items-center justify-center border border-[#A08D52]/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#A08D52] tracking-tight">
            {deanApprovedCount}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="text-[#5C6753] font-bold">موثقة تنفيذياً</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">رسمي</span>
          </div>
        </div>

        {/* Widget 4: مسترجعة للتعديل */}
        <button
          type="button"
          onClick={() => setActiveTab('returned')}
          className={`text-right p-4 rounded-[32px] bg-white border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${
            activeTab === 'returned'
              ? 'border-rose-400 shadow-[0_8px_25px_rgba(244,63,94,0.18)] ring-2 ring-rose-400/20'
              : 'border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] hover:shadow-md hover:border-[#46523B]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-500">مسترجعة</span>
            <div className="w-8 h-8 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center border border-rose-200/60 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
            {returnedRequests.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="text-rose-800 font-bold">بانتظار استيفاء الملاحظات</span>
            <span className="text-rose-700 font-black group-hover:translate-x-[-2px] transition-transform">عرض ←</span>
          </div>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-3 gap-2 bg-[#FAF9F6] p-1.5 rounded-[32px] border border-[#46523B]/10 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/20 font-black'
              : 'text-slate-600 hover:text-[#46523B] hover:bg-white/80'
          }`}
        >
          <Stamp className={`w-4 h-4 ${activeTab === 'pending' ? 'text-[#A08D52]' : 'text-slate-400'}`} />
          <span>بانتظار التدقيق</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'pending'
                ? 'bg-[#A08D52] text-white'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {pendingRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/20 font-black'
              : 'text-slate-600 hover:text-[#46523B] hover:bg-white/80'
          }`}
        >
          <CheckCheck className={`w-4 h-4 ${activeTab === 'approved' ? 'text-[#A08D52]' : 'text-slate-400'}`} />
          <span>المعتمدة نهائياً</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'approved'
                ? 'bg-[#A08D52] text-white'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {approvedRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('returned')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'returned'
              ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/20 font-black'
              : 'text-slate-600 hover:text-[#46523B] hover:bg-white/80'
          }`}
        >
          <RotateCcw className={`w-4 h-4 ${activeTab === 'returned' ? 'text-[#A08D52]' : 'text-slate-400'}`} />
          <span>المسترجعة</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'returned'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-100 text-rose-900'
            }`}
          >
            {returnedRequests.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: بانتظار التدقيق */}
      {activeTab === 'pending' && (
        <div className="space-y-4 animate-fade-slide-up">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-[32px] p-10 text-center border border-[#46523B]/10 shadow-sm">
              <div className="w-14 h-14 bg-[#46523B]/10 text-[#46523B] rounded-[32px] flex items-center justify-center mx-auto mb-3">
                <CheckCheck className="w-7 h-7 text-[#A08D52]" />
              </div>
              <h3 className="text-sm font-black text-[#46523B] mb-1">
                سجل التدقيق محدث ومكتمل بالكامل
              </h3>
              <p className="text-xs text-slate-500">
                لا توجد طلبات جديدة بانتظار التدقيق الإداري في الوقت الحالي.
              </p>
            </div>
          ) : (
            pendingRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-[32px] p-4 sm:p-6 shadow-[0_4px_24px_-2px_rgba(70,82,59,0.06)] hover:shadow-lg transition-all duration-200 border border-[#46523B]/12 relative overflow-hidden"
              >
                {/* 1. Header Info Bar with Media Badge & Dean Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-slate-900 tracking-tight">
                        {r.name}
                      </h4>
                      <span className="text-[10px] font-bold text-[#46523B] bg-[#46523B]/10 px-2.5 py-0.5 rounded-full border border-[#46523B]/20">
                        {r.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">جهة التنفيذ: {r.presenter}</span>
                      {r.branch && <span className="text-slate-400">• {r.branch}</span>}
                      {r.transactionNumber && (
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{r.transactionNumber}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Top Badges Island: Publicity Badge + Dean Approval */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    {/* شارة النشر الإعلامي (Publicity Badge) متضامنة في أعلى البطاقة */}
                    <MediaPublishBadge request={r} interactive={false} />

                    {r.deanApproved ? (
                      <span className="text-[10px] font-bold bg-[#46523B]/10 text-[#46523B] px-2.5 py-1 rounded-xl border border-[#46523B]/20 flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#46523B]" />
                        <span>معتمد من رئيس الكلية</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
                        بانتظار توثيق رئيس الكلية
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Stepper شريط متابعة مراحل المعاملة الزمني التفاعلي من 4 مراحل */}
                <WorkflowStepper
                  request={r}
                  viewerRole="auditor"
                  mode="4-step"
                  showSummaryBadge={true}
                />

                {/* 3. Activity Parameters & Schedule Details */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 bg-[#FAF9F6] p-3 rounded-2xl mb-4 border border-[#46523B]/10">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.startDate || r.date}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.hours} ساعات تدريبية</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    {r.deliveryMode === 'عن بعد' ? (
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-[#A08D52]" />
                    )}
                    <span>
                      {r.deliveryMode === 'عن بعد'
                        ? 'عن بعد'
                        : r.physicalLocation || r.location || 'حضوري'}
                    </span>
                  </span>
                  {r.unit && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.unit}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* 4. Form Modification & Review Quick Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* تعديل حقول الاستمارة مباشرة */}
                    <button
                      type="button"
                      onClick={() => setEditingRequest(r)}
                      className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300/80 flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                      <span>تعديل حقول الاستمارة</span>
                    </button>

                    {/* معاينة كافة الحقول في نافذة مفصلة */}
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="text-xs text-slate-700 hover:text-[#46523B] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة تفاصيل الاستمارة</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    المدير المعتمد: {r.coordinatorName || 'معتمد'}
                  </span>
                </div>

                {/* 5. Administrative Decision Actions */}
                <div className="space-y-2.5">
                  {/* مسار توثيق رئيس الكلية الإداري */}
                  {!r.deanApproved ? (
                    <div className="p-3 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 rounded-2xl border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-[#A08D52] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            مسار الاعتماد الإداري (رئيس الكلية):
                          </p>
                          <p className="text-[11px] text-slate-500">
                            يلزم توثيق اعتماد سعادة رئيس الكلية إدارياً لتثبيت ساعات النشاط قبل الرفع لمنصة ارتقاء.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeanApprove(r.id)}
                        className="bg-[#46523B] hover:opacity-95 text-[#A08D52] hover:text-white text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150 cursor-pointer shrink-0 border border-[#A08D52]/40"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>رفع لرئيس الكلية للاعتماد الرسمي</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>تم توثيق الاعتماد الإداري من سعادة رئيس الكلية رسمياً</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-mono">
                        {r.deanApprovalDate ? `تاريخ: ${r.deanApprovalDate}` : 'معتمد'}
                      </span>
                    </div>
                  )}

                  {/* Primary Decision Actions */}
                  <div className="flex items-center gap-2.5 pt-1">
                    {/* اعتماد وتوجيه للرفع على ارتقاء */}
                    <button
                      type="button"
                      onClick={() => setDispatchingRequest(r)}
                      className="flex-1 bg-[#46523B] hover:bg-[#384230] text-[#A08D52] hover:text-white font-black py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-150 cursor-pointer border border-[#A08D52]/30"
                    >
                      <Send className="w-4 h-4" />
                      <span>اعتماد وتوجيه للرفع على ارتقاء</span>
                    </button>

                    {/* إرجاع للمدير المباشر أو الموظف */}
                    <button
                      type="button"
                      onClick={() => setReturningRequestId(r.id)}
                      className="flex-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-rose-300 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                    >
                      <Undo2 className="w-4 h-4" />
                      <span>إرجاع للمدير المباشر أو الموظف</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 2: معتمدة نهائياً */}
      {activeTab === 'approved' && (
        <div className="space-y-4 animate-fade-slide-up">
          {approvedRequests.length === 0 ? (
            <div className="bg-white rounded-[32px] p-10 text-center border border-[#46523B]/10 shadow-sm">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-[32px] flex items-center justify-center mx-auto mb-3">
                <CheckCheck className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-1">
                لا توجد طلبات معتمدة نهائياً حتى الآن
              </h3>
              <p className="text-xs text-slate-500">
                الطلبات التي يتم تدقيقها واعتمادها ستظهر هنا بمسارها الكامل.
              </p>
            </div>
          ) : (
            approvedRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-[32px] p-4 sm:p-6 shadow-[0_4px_24px_-2px_rgba(70,82,59,0.06)] hover:shadow-lg transition-all duration-200 border border-[#46523B]/12 relative overflow-hidden border-r-4 border-r-emerald-600"
              >
                {/* Header with Media Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-slate-900">
                        {r.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {r.presenter} • {r.branch}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <MediaPublishBadge request={r} interactive={false} />
                    <StatusBadge status={r.status} note={r.note} />
                  </div>
                </div>

                {/* Stepper */}
                <WorkflowStepper
                  request={r}
                  viewerRole="auditor"
                  mode="4-step"
                  showSummaryBadge={true}
                />

                {/* Dispatch Info Summary */}
                <div className="bg-[#FAF9F6] p-3 rounded-2xl text-xs mb-3 border border-[#46523B]/10 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#46523B]" />
                    <span className="text-slate-500 font-medium">المكلف بالرفع لمنصة ارتقاء:</span>
                    <strong className="text-slate-900 font-black">
                      {r.assignedUploader || 'مسؤول الرفع لمنصة ارتقاء'}
                    </strong>
                  </div>

                  {r.uploaderInstructions && (
                    <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span className="font-bold text-[#46523B]">توجيهات التدقيق: </span>
                      <span>{r.uploaderInstructions}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="flex-1 bg-[#46523B] hover:bg-[#384230] text-[#A08D52] hover:text-white font-black py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <FileSearch className="w-4 h-4" />
                    <span>عرض الاستمارة والتاريخ الإداري</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingRequest(r)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل الحقول</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 3: مُرجعة للتعديل */}
      {activeTab === 'returned' && (
        <div className="space-y-4 animate-fade-slide-up">
          {returnedRequests.length === 0 ? (
            <div className="bg-white rounded-[32px] p-10 text-center border border-[#46523B]/10 shadow-sm">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-[32px] flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-1">
                سجل التدقيق خالٍ من الطلبات المرجعة
              </h3>
              <p className="text-xs text-slate-500">
                لم يتم إرجاع أي نشاط للمدير المباشر أو الموظف مؤخراً.
              </p>
            </div>
          ) : (
            returnedRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-[32px] p-4 sm:p-6 shadow-[0_4px_24px_-2px_rgba(70,82,59,0.06)] hover:shadow-lg transition-all duration-200 border border-[#46523B]/12 relative overflow-hidden border-r-4 border-r-rose-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.presenter} • {r.branch}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <MediaPublishBadge request={r} interactive={false} />
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2.5 py-1 rounded-xl border border-rose-200">
                      {r.status === 'returned_emp' ? 'مُرجع للموظف' : 'مُرجع للمدير المباشر'}
                    </span>
                  </div>
                </div>

                {/* Stepper */}
                <WorkflowStepper
                  request={r}
                  viewerRole="auditor"
                  mode="4-step"
                  showSummaryBadge={true}
                />

                {r.note && (
                  <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 text-xs text-rose-950 mb-3">
                    <p className="font-bold flex items-center gap-1.5 text-xs mb-1 text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>سبب الإرجاع المدون:</span>
                    </p>
                    <p className="leading-relaxed bg-white/80 p-2.5 rounded-xl border border-rose-200/60 font-medium">
                      {r.note}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-xs text-slate-700 hover:text-[#46523B] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-slate-400" />
                    <span>مراجعة بيانات النشاط</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingRequest(r)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل الاستمارة</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL 1: Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        viewerRole="auditor"
      />

      {/* MODAL 2: Form Edit Modal (صلاحية 1) */}
      <EditActivityModal
        request={editingRequest}
        isOpen={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        onSave={(updated) => onUpdateRequest(updated)}
      />

      {/* MODAL 3: Smart Dispatch & Assignee Modal (صلاحية 3) */}
      <DispatchApprovalModal
        request={dispatchingRequest}
        isOpen={!!dispatchingRequest}
        onClose={() => setDispatchingRequest(null)}
        onConfirmDispatch={(payload) => onFinalApproveWithDispatch(payload)}
      />

      {/* MODAL 4: Return Note Modal with target selection (صلاحية 4) */}
      <ReturnNoteModal
        isOpen={!!returningRequestId}
        title="إرجاع الطلب للمدير المباشر أو الموظف"
        allowRoleSelection={true}
        initialRole="manager"
        onConfirm={(note, selectedTargetRole) => {
          if (returningRequestId) {
            onReturnClick(returningRequestId, selectedTargetRole || 'manager', note);
            setReturningRequestId(null);
          }
        }}
        onCancel={() => setReturningRequestId(null)}
      />
    </div>
  );
};

export default AuditorView;
