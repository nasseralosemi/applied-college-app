import React from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { CloudUpload, CloudCheck, Calendar, Clock, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onConfirmUpload: (id: number) => void;
}

export const UploaderView: React.FC<Props> = ({
  requests,
  onConfirmUpload,
}) => {
  const readyRequests = requests.filter(
    (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
          <CloudUpload className="w-4 h-4 text-[#c59b27]" />
          <span>أخذ البيانات والرفع لمنصة ارتقاء</span>
        </h2>
        <span className="text-[10px] bg-green-50 text-green-900 font-bold px-2 py-0.5 rounded-full border border-green-200">
          {readyRequests.length} نشاط معتمد ومكتمل
        </span>
      </div>

      {readyRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <CloudUpload className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-800 mb-1">
            لا توجد طلبات معتمدة جاهزة للرفع حالياً
          </p>
          <p className="text-[11px] text-gray-400">
            تظهر الأنشطة هنا فور استكمال اعتماد رئيس الكلية والضوابط.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {readyRequests.map((r) => {
            const isUploaded = r.status === 'uploaded_irtqaa';
            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-r-4 transition ${
                  isUploaded ? 'border-r-[#1b4332]' : 'border-r-emerald-500'
                } hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {r.type}
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      الجهة: {r.presenter}
                    </p>
                  </div>
                  <StatusBadge status={r.status} note={r.note} />
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

                <p className="text-[11px] text-gray-600 mb-3 bg-gray-50/70 p-2 rounded-lg italic">
                  اكتملت كافة الموافقات الرسمية واعتماد الكلية، البيانات وكشوفات الحضور مكتملة ومطابقة لمعايير منصة ارتقاء.
                </p>

                {!isUploaded ? (
                  <button
                    type="button"
                    onClick={() => onConfirmUpload(r.id)}
                    className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/20 transition cursor-pointer"
                  >
                    <CloudUpload className="w-4 h-4 text-[#e6c566]" />
                    <span>تأكيد الرفع إلى منصة ارتقاء الرسمية</span>
                  </button>
                ) : (
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تمت المزامنة بنجاح في السجل المهاري</span>
                    </span>
                    <span className="text-[#1b4332] font-bold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      <span>منصة ارتقاء</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
