import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
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
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onConfirmUpload: (id: number) => void;
}

export const UploaderView: React.FC<Props> = ({
  requests,
  onConfirmUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'ready' | 'uploaded' | 'all'>('ready');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

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
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 p-2.5 rounded-2xl text-xs font-bold border border-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>تم توثيق الساعات في منصة ارتقاء بنجاح</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md">
                      سجل رقم #{r.id}-IRTQ
                    </span>
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
    </div>
  );
};
