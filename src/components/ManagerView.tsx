import React from 'react';
import { ActivityRequest } from '../types';
import { ClipboardCheck, Check, CornerUpLeft, Calendar, Clock, MapPin, UserCheck } from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onApprove: (id: number) => void;
  onReturnClick: (id: number) => void;
}

export const ManagerView: React.FC<Props> = ({
  requests,
  onApprove,
  onReturnClick,
}) => {
  const pendingRequests = requests.filter(
    (r) => r.status === 'pending_manager' || r.status === 'returned_manager'
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
          <ClipboardCheck className="w-4 h-4 text-[#c59b27]" />
          <span>طلبات بانتظار موافقتك (المدير المباشر)</span>
        </h2>
        <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
          {pendingRequests.length} بانتظار الاعتماد
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-[#1b4332] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-800 mb-1">
            لا توجد طلبات تنتظر موافقتك حالياً
          </p>
          <p className="text-[11px] text-gray-400">
            تمت معالجة كافة طلبات الأنشطة المرفوعة من منسوبي الوحدة بنجاح.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((r) => {
            const isReturnedFromAuditor = r.status === 'returned_manager';
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-r-4 border-r-[#c59b27] hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      👤 مقدم الطلب: {r.presenter}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    isReturnedFromAuditor
                      ? 'bg-amber-50 text-amber-900 border border-amber-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isReturnedFromAuditor ? 'مُعاد من التدقيق' : 'طلب جديد'}
                  </span>
                </div>

                {isReturnedFromAuditor && r.note && (
                  <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    <span className="font-bold">ملاحظة موظف التدقيق:</span> {r.note}
                  </div>
                )}

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

                <div className="bg-gray-50/70 p-2 rounded-lg text-[11px] text-gray-600 mb-3 italic">
                  <span className="font-bold not-italic text-gray-700">الملخص: </span>
                  {r.summary || 'لا يوجد ملخص إضافي'}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
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
                    className="flex-1 bg-gray-100 hover:bg-amber-50 text-gray-700 hover:text-amber-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-gray-200 hover:border-amber-300 transition cursor-pointer"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                    <span>إرجاع بملاحظة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
