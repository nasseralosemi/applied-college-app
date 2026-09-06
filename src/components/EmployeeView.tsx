import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { PlusCircle, Calendar, Clock, MapPin, Send, History, Sparkles } from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onSubmitRequest: (newReq: Omit<ActivityRequest, 'id' | 'status' | 'note'>) => void;
  onResubmitRequest?: (id: number) => void;
}

export const EmployeeView: React.FC<Props> = ({
  requests,
  onSubmitRequest,
  onResubmitRequest,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('ورشة عمل');
  const [presenter, setPresenter] = useState('وحدة شؤون الطلاب - فرع الزلفي');
  const [date, setDate] = useState('2026-09-25');
  const [hours, setHours] = useState('2');
  const [location, setLocation] = useState('عن بعد - Blackboard');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmitRequest({
      name: name.trim(),
      type,
      presenter: presenter.trim() || 'الكلية التطبيقية',
      date: date || new Date().toISOString().split('T')[0],
      hours: hours || '2',
      location: location.trim() || 'حضوري',
      summary: summary.trim() || 'استيفاء خطة الأنشطة المعتمدة بالكلية',
    });

    // Reset fields
    setName('');
    setSummary('');
  };

  const setQuickTemplate = (presetType: string, presetName: string, presetHours: string) => {
    setType(presetType);
    setName(presetName);
    setHours(presetHours);
  };

  return (
    <div className="space-y-4">
      {/* Form Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-[#c59b27]" />
            <span>تقديم استمارة منصة ارتقاء جديدة</span>
          </h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            نموذج رسمي
          </span>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-3 flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          <span className="text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c59b27]" />
            قوالب جاهزة:
          </span>
          <button
            type="button"
            onClick={() => setQuickTemplate('ورشة عمل', 'ورشة مهارات كتابة السيرة الذاتية', '2')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap"
          >
            ورشة سيرة ذاتية
          </button>
          <button
            type="button"
            onClick={() => setQuickTemplate('دورة تدريبية', 'دورة التحليل الإحصائي SPSS', '4')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap"
          >
            دورة إحصائية
          </button>
          <button
            type="button"
            onClick={() => setQuickTemplate('نشاط طلابي', 'هاكاثون التطبيقات الذكية', '6')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap"
          >
            هاكاثون طلابي
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                نوع النشاط
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
              >
                <option value="ورشة عمل">ورشة عمل</option>
                <option value="دورة تدريبية">دورة تدريبية</option>
                <option value="نشاط طلابي">نشاط طلابي</option>
                <option value="معرض / ملتقى">معرض / ملتقى</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                اسم النشاط *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: وثق إنجازك"
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              مقدم النشاط والوحدة المشرفة
            </label>
            <input
              type="text"
              value={presenter}
              onChange={(e) => setPresenter(e.target.value)}
              placeholder="وحدة شؤون الطلاب - فرع الزلفي"
              className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                التاريخ المجدول
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                عدد الساعات التدريبية
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              حالة النشاط والموقع / الرابط
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="عن بعد (رابط البلاك بورد) / حضوري"
              className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              ملخص النشاط والأهداف
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="اكتب ملخصاً موجزاً للنشاط ومخرجاته التعليمية..."
              className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/20 transition cursor-pointer mt-2"
          >
            <Send className="w-4 h-4 text-[#e6c566]" />
            <span>تقديم استمارة النشاط للاعتماد</span>
          </button>
        </form>
      </div>

      {/* Tracking Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#c59b27]" />
            <span>طلباتي الأخيرة ({requests.length})</span>
          </h2>
          <span className="text-[11px] text-[#c59b27] font-bold">تحديث فوري</span>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">لم تقم برفع أي طلبات حتى الآن.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const borderAccentColor =
                r.status === 'uploaded_irtqaa'
                  ? 'border-r-[#1b4332]'
                  : r.status === 'approved_final' || r.status === 'pending_auditor'
                  ? 'border-r-emerald-500'
                  : r.status === 'returned_emp' || r.status === 'returned_manager'
                  ? 'border-r-rose-500'
                  : 'border-r-[#c59b27]';

              return (
                <div
                  key={r.id}
                  className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 border-r-4 ${borderAccentColor} hover:shadow-md transition`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                        <span>{r.name}</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {r.type}
                        </span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {r.presenter}
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <StatusBadge status={r.status} note={r.note} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{r.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{r.hours} ساعات تدريبية</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{r.location}</span>
                    </span>
                  </div>

                  {r.summary && (
                    <div className="bg-gray-50/80 p-2 rounded-lg text-[11px] text-gray-600 line-clamp-2 italic mb-2">
                      {r.summary}
                    </div>
                  )}

                  {r.status === 'returned_emp' && onResubmitRequest && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-rose-700 font-bold">
                        تم الإرجاع، يمكنك إعادة الرفع بعد المعالجة:
                      </span>
                      <button
                        type="button"
                        onClick={() => onResubmitRequest(r.id)}
                        className="text-[11px] bg-[#c59b27] hover:bg-[#b0881e] text-[#081c15] font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        إعادة الرفع للمدير
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
