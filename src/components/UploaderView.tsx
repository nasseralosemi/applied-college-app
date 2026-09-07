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
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif]">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
            <CloudUpload className="w-4 h-4 text-[#c59b27]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#1b4332] leading-tight">
              أخذ البيانات والرفع لمنصة ارتقاء الرسمية
            </h2>
            <p className="text-[10px] text-slate-500">
              تصدير ومزامنة سجل الأنشطة المعتمدة في السجل المهاري للجامعة
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
          {readyRequests.length} معتمد ومكتمل
        </span>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        {/* Tab 1: جاهز للرفع */}
        <button
          type="button"
          onClick={() => setActiveTab('ready')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'ready'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
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
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
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

        {/* Tab 3: الكل */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="whitespace-nowrap">كافة الأنشطة</span>
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

      {/* Tab Content */}
      <div className="space-y-3 animate-fade-slide-up">
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
              تظهر الأنشطة هنا فور استكمال اعتماد رئيس الكلية ولجنة الضوابط.
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

                {/* Rich Field Badges */}
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

                <p className="text-[11px] text-slate-700 mb-3 bg-slate-50/80 p-2.5 rounded-xl italic border border-slate-100">
                  اكتملت كافة الموافقات الرسمية واعتماد الكلية، البيانات وكشوفات الحضور مطابقة لمعايير منصة ارتقاء.
                </p>

                {/* View Details Link */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/60 px-3 py-1.5 rounded-xl border border-slate-200"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>معاينة الاستمارة الرسمية للرفع</span>
                  </button>
                  {r.transactionNumber && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      معاملة: {r.transactionNumber}
                    </span>
                  )}
                </div>

                {!isUploaded ? (
                  <button
                    type="button"
                    onClick={() => onConfirmUpload(r.id)}
                    className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
                  >
                    <CloudUpload className="w-4 h-4 text-[#e6c566]" />
                    <span>تأكيد الرفع إلى منصة ارتقاء الرسمية</span>
                  </button>
                ) : (
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>تمت المزامنة بنجاح في السجل المهاري</span>
                    </span>
                    <span className="text-[#1b4332] font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                      <span>منصة ارتقاء</span>
                      <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Full Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
