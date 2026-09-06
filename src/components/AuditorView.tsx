import React from 'react';
import { ActivityRequest } from '../types';
import { Stamp, ShieldCheck, CheckCheck, Undo2, Calendar, Clock, MapPin, Award } from 'lucide-react';

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
  const pendingRequests = requests.filter((r) => r.status === 'pending_auditor');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
          <Stamp className="w-4 h-4 text-[#c59b27]" />
          <span>مراجعة الضوابط واعتماد الكلية (التدقيق)</span>
        </h2>
        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
          {pendingRequests.length} جاهز للمراجعة
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-[#1b4332] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-800 mb-1">
            لا توجد طلبات بانتظار تدقيق الضوابط
          </p>
          <p className="text-[11px] text-gray-400">
            كافة طلبات الأنشطة الحالية مستوفية للاعتماد أو تم رفعها.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-r-4 border-r-emerald-500 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span>{r.name}</span>
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {r.type}
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    جهة التنفيذ: {r.presenter}
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  معتمد من المدير
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl mb-2.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.hours} ساعات</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.location}</span>
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 mb-3 flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  مستوفٍ استمارة منصة ارتقاء وموافقات الشراكات والضوابط التنظيمية بالكلية التطبيقية، بانتظار الاعتماد النهائي من سعادة الرئيس/العميد.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onFinalApprove(r.id)}
                  className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#e6c566]" />
                  <span>اعتماد رئيس الكلية (نهائي)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReturnToManagerClick(r.id)}
                  className="flex-1 bg-gray-100 hover:bg-amber-50 text-gray-700 hover:text-amber-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-gray-200 hover:border-amber-300 transition cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>إرجاع للمدير المباشر</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
