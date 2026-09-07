import React, { useState } from 'react';
import { ActivityRequest, RequestStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
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
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onFinalApprove: (id: number) => void;
  onReturnToManagerClick: (id: number) => void;
}

export const AuditorView: React.FC<Props> = ({
  requests,
  onFinalApprove,
  onReturnToManagerClick,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'returned'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending_auditor');
  const approvedRequests = requests.filter(
    (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  );
  const returnedRequests = requests.filter((r) => r.status === 'returned_manager');

  // Mini Workflow Timeline for Auditor
  const renderWorkflowTimeline = (status: RequestStatus) => {
    const isStage1Done = true;
    const isStage2Done = true;
    const isStage3Done = status === 'approved_final' || status === 'uploaded_irtqaa';
    const isStage3Active = status === 'pending_auditor';
    const isStage4Done = status === 'uploaded_irtqaa';
    const isStage4Active = status === 'approved_final';

    return (
      <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 mb-3 space-y-2">
        <div className="pt-1">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0 rounded-full" />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 h-1 bg-[#1b4332] z-0 transition-all duration-300 rounded-full"
              style={{
                width: isStage4Done
                  ? 'calc(100% - 32px)'
                  : isStage4Active
                  ? 'calc(80% - 32px)'
                  : isStage3Active
                  ? 'calc(50% - 32px)'
                  : 'calc(25% - 32px)',
              }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-[8px] sm:text-[9px] mt-1 font-bold text-[#1b4332] whitespace-nowrap">
                التقديم
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-[8px] sm:text-[9px] mt-1 font-bold text-[#1b4332] whitespace-nowrap">
                المدير
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs ${
                  isStage3Done
                    ? 'bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]'
                    : isStage3Active
                    ? 'bg-amber-500 text-white ring-2 ring-amber-200 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStage3Done ? (
                  <Check className="w-3 h-3" />
                ) : isStage3Active ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  '3'
                )}
              </div>
              <span
                className={`text-[8px] sm:text-[9px] mt-1 whitespace-nowrap ${
                  isStage3Done
                    ? 'font-bold text-[#1b4332]'
                    : isStage3Active
                    ? 'font-bold text-amber-800'
                    : 'text-slate-400'
                }`}
              >
                التدقيق
              </span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs ${
                  isStage4Done
                    ? 'bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]'
                    : isStage4Active
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStage4Done ? (
                  <Check className="w-3 h-3" />
                ) : isStage4Active ? (
                  <CloudUpload className="w-3 h-3" />
                ) : (
                  '4'
                )}
              </div>
              <span
                className={`text-[8px] sm:text-[9px] mt-1 whitespace-nowrap ${
                  isStage4Done
                    ? 'font-bold text-[#1b4332]'
                    : isStage4Active
                    ? 'font-bold text-emerald-800'
                    : 'text-slate-400'
                }`}
              >
                ارتقاء
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif]">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
            <Stamp className="w-4 h-4 text-[#c59b27]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#1b4332] leading-tight">
              مراجعة الضوابط والاعتماد النهائي (التدقيق)
            </h2>
            <p className="text-[10px] text-slate-500">
              التحقق من ضوابط الكلية والاعتماد قبل الرفع المباشر لمنصة ارتقاء
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
          إجمالي: {requests.length}
        </span>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        {/* Tab 1: بانتظار التدقيق */}
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="whitespace-nowrap">بانتظار التدقيق</span>
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
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5 text-[#e6c566]" />
            <span className="whitespace-nowrap">معتمدة نهائياً</span>
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

        {/* Tab 3: مُرجعة للمدير */}
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
            <span className="whitespace-nowrap">مُرجعة</span>
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
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    معتمد من المدير
                  </span>
                </div>

                {/* Timeline */}
                {renderWorkflowTimeline(r.status)}

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

                <div className="p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] text-emerald-950 mb-3 flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    مستوفٍ حقول استمارة منصة ارتقاء وموافقات الشراكات والضوابط التنظيمية بالكلية، بانتظار الاعتماد النهائي لرفع الساعات.
                  </p>
                </div>

                {/* View Full Form Details Link */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-3 py-1.5 rounded-xl border border-slate-200"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>تدقيق ومراجعة كافة حقول الاستمارة</span>
                  </button>
                  {r.transactionNumber && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      معاملة: {r.transactionNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onFinalApprove(r.id)}
                    className="flex-1 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
                  >
                    <CheckCheck className="w-4 h-4 text-[#e6c566]" />
                    <span>اعتماد نهائي للرفع على ارتقاء</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReturnToManagerClick(r.id)}
                    className="flex-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-300 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>إرجاع للمدير المباشر</span>
                  </button>
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

                {renderWorkflowTimeline(r.status)}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <FileSearch className="w-4 h-4 text-[#e6c566]" />
                    <span>عرض تفاصيل الاستمارة والتاريخ الإداري</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 3: مُرجعة للمدير */}
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
            </div>
          ) : (
            returnedRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 border-r-amber-500"
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
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                    مُرجع للمدير المباشر
                  </span>
                </div>

                {r.note && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900">
                    <span className="font-bold block mb-0.5">ملاحظة التدقيق المُرسلة:</span>
                    <p>{r.note}</p>
                  </div>
                )}

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

      {/* Full Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
