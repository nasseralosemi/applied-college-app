import React, { useState } from 'react';
import { ActivityRequest, RequestStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { EditActivityModal } from './EditActivityModal';
import { DispatchApprovalModal } from './DispatchApprovalModal';
import { ReturnNoteModal } from './ReturnNoteModal';
import {
  Stamp,
  ShieldCheck,
  CheckCheck,
  Undo2,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Award,
  ExternalLink,
  Building2,
  Send,
  RotateCcw,
  Check,
  CloudUpload,
  UserCheck,
  ArrowLeft,
  FileSearch,
  Edit3,
  CheckCircle2,
  Share2,
  FileText,
  AlertCircle,
  HelpCircle,
  BookmarkCheck,
} from 'lucide-react';

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
}

export const AuditorView: React.FC<Props> = ({
  requests,
  onUpdateRequest,
  onDeanApprove,
  onFinalApproveWithDispatch,
  onReturnClick,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'returned'>('pending');
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

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0 border border-[#1b4332]/20">
            <Stamp className="w-5 h-5 text-[#c59b27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                وحدة التدقيق والاعتماد
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#1b4332]">
                مراجعة وتدقيق معايير الأنشطة والاعتماد الإداري
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مراجعة وتعديل حقول الاستمارة، توثيق اعتماد رئيس الكلية، والتوجيه لمنصة ارتقاء
            </p>
          </div>
        </div>
      </div>

      {/* Unified 4-Card KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">بانتظار تدقيقي</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Stamp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{pendingRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">قيد فحص الضوابط</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">معتمدة للرفع</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{approvedRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">تم تحويلها لرافع ارتقاء</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">اعتماد رئيس الكلية</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1">{requests.filter((r) => r.deanApproved || r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">موثقة تنفيذياً</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">مسترجعة</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700 mt-1">{returnedRequests.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">أعيدت للتعديل والملاحظات</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Tab 1: بانتظار التدقيق */}
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Stamp className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">بانتظار تدقيقي</span>
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

        {/* Tab 2: معتمدة نهائياً */}
        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">معتمدة وموجهة</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'approved'
                ? 'bg-[#c59b27] text-slate-950'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {approvedRequests.length}
          </span>
        </button>

        {/* Tab 3: مُرجعة */}
        <button
          type="button"
          onClick={() => setActiveTab('returned')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'returned'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="whitespace-nowrap">مُرجعة للتعديل</span>
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

      {/* TAB CONTENT 1: بانتظار التدقيق */}
      {activeTab === 'pending' && (
        <div className="space-y-3 animate-fade-slide-up">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-[#1b4332] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                لا توجد طلبات بانتظار تدقيق الضوابط
              </p>
              <p className="text-[11px] text-slate-400">
                كافة طلبات الأنشطة الحالية مستوفية للاعتماد أو تم رفعها لمنصة ارتقاء.
              </p>
            </div>
          ) : (
            pendingRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 border-r-sky-500"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>جهة التنفيذ: {r.presenter}</span>
                      {r.branch && <span className="text-slate-400">• {r.branch}</span>}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                      معتمد من المدير
                    </span>
                    {r.deanApproved ? (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>معتمد من رئيس الكلية</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                        بانتظار توثيق رئيس الكلية
                      </span>
                    )}
                  </div>
                </div>

                {/* Badges */}
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

                {/* Form Modification & Review Quick Bar (صلاحية 1) */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* صلاحية 1: تعديل حقول الاستمارة مباشرة */}
                    <button
                      type="button"
                      onClick={() => setEditingRequest(r)}
                      className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                      <span>تعديل حقول الاستمارة</span>
                    </button>

                    {/* مراجعة كافة الحقول في نافذة مفصلة */}
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="text-xs text-slate-700 hover:text-[#1b4332] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة تفاصيل الاستمارة</span>
                    </button>
                  </div>

                  {r.transactionNumber && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono">
                      معاملة: {r.transactionNumber}
                    </span>
                  )}
                </div>

                {/* Administrative Workflow Action Buttons */}
                <div className="space-y-2">
                  {/* صلاحية 2: مسار الاعتماد الإداري لرئيس الكلية */}
                  {!r.deanApproved ? (
                    <div className="p-3 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
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
                        className="bg-gradient-to-r from-[#1b4332] to-[#143728] hover:opacity-95 text-[#e6c566] text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150 cursor-pointer shrink-0 border border-[#c59b27]/30"
                      >
                        <Award className="w-3.5 h-3.5 text-[#e6c566]" />
                        <span>رفع لرئيس الكلية للاعتماد الرسمي</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>تم توثيق الاعتماد الإداري من سعادة رئيس الكلية رسمياً</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono">
                        {r.deanApprovalDate ? `تاريخ: ${r.deanApprovalDate}` : 'معتمد'}
                      </span>
                    </div>
                  )}

                  {/* Primary Decision Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* صلاحية 3: التوجيه الذكي وتعيين المسؤول المختص */}
                    <button
                      type="button"
                      onClick={() => setDispatchingRequest(r)}
                      className="flex-1 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
                    >
                      <Send className="w-4 h-4 text-[#e6c566]" />
                      <span>اعتماد وتوجيه للرفع على ارتقاء</span>
                    </button>

                    {/* صلاحية 4: إرجاع للمدير المباشر أو الموظف */}
                    <button
                      type="button"
                      onClick={() => setReturningRequestId(r.id)}
                      className="flex-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-bold py-3.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-300 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
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
        <div className="space-y-3 animate-fade-slide-up">
          {approvedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                لا توجد طلبات معتمدة نهائياً حتى الآن
              </p>
            </div>
          ) : (
            approvedRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 border-r-emerald-500"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.presenter} • {r.branch}
                    </p>
                  </div>
                  <StatusBadge status={r.status} note={r.note} />
                </div>

                {/* Dispatch Info Summary (خالي من تفاصيل النشر الإعلامي) */}
                <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px] mb-3 border border-slate-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span className="text-slate-500">المكلف بالرفع:</span>
                    <strong className="text-slate-800">
                      {r.assignedUploader || 'مسؤول الرفع لمنصة ارتقاء'}
                    </strong>
                  </div>

                  {r.uploaderInstructions && (
                    <div className="col-span-full pt-1 border-t border-slate-200/50 text-[10px] text-slate-600">
                      <span className="font-bold text-slate-700">توجيهات المدقق: </span>
                      <span>{r.uploaderInstructions}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <FileSearch className="w-4 h-4 text-[#e6c566]" />
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
        <div className="space-y-3 animate-fade-slide-up">
          {returnedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                سجل التدقيق خالٍ من الطلبات المرجعة
              </p>
              <p className="text-[11px] text-slate-400">
                لم يتم إرجاع أي نشاط للمدير المباشر أو الموظف مؤخراً.
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
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.presenter} • {r.branch}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200">
                    {r.status === 'returned_emp' ? 'مُرجع للموظف' : 'مُرجع للمدير المباشر'}
                  </span>
                </div>

                {r.note && (
                  <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs text-rose-900 mb-3">
                    <p className="font-bold flex items-center gap-1 text-[11px] mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>سبب الإرجاع المدون:</span>
                    </p>
                    <p className="leading-relaxed bg-white/70 p-2 rounded-xl border border-rose-100">
                      {r.note}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-xs text-slate-700 hover:text-[#1b4332] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer"
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
