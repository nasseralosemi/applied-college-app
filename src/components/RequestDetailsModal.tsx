import React from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  X,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Building2,
  Users,
  UserCheck,
  Tag,
  FileCheck2,
  ExternalLink,
  History,
  CheckCircle2,
  ShieldCheck,
  CloudUpload,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#c59b27]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#c59b27]/25 border border-[#c59b27]/50 flex items-center justify-center text-[#e6c566] shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold leading-tight">تفاصيل استمارة النشاط المعتمدة</h3>
              <p className="text-[10px] text-emerald-200/90">
                طلب رقم: #{request.id} • منصة ارتقاء
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {/* Status & Title Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20">
                {request.type}
              </span>
              <StatusBadge status={request.status} note={request.note} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {request.name}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              مقدم النشاط: <span className="font-semibold text-slate-700">{request.presenter}</span>
            </p>
          </div>

          {/* Group 1: Basic Info & Units */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b4332]">
              <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>1. البيانات الأساسية والوحدة المشرفة</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">الوحدة المشرفة:</span>
                <span className="font-semibold text-slate-800">{request.unit || 'وحدة شؤون الطلاب'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الفرع:</span>
                <span className="font-semibold text-slate-800">{request.branch || 'فرع الزلفي - شطر الطلاب'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">منسق النشاط:</span>
                <span className="font-semibold text-slate-800">{request.coordinatorName || request.presenter}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تصنيف النشاط:</span>
                <span className="font-semibold text-slate-800">{request.type}</span>
              </div>
            </div>
          </div>

          {/* Group 2: Schedule & Timing */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b4332]">
              <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>2. التوقيت والمواعيد والساعات</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/70 p-2.5 rounded-xl text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ البداية:</span>
                <span className="font-semibold text-slate-800">{request.startDate || request.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ النهاية:</span>
                <span className="font-semibold text-slate-800">{request.endDate || request.startDate || request.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">وقت البداية:</span>
                <span className="font-semibold text-slate-800">{request.startTime || '10:00 ص'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الساعات التدريبية:</span>
                <span className="font-bold text-[#1b4332]">{request.hours} ساعات</span>
              </div>
            </div>
          </div>

          {/* Group 3: Audience & Delivery Mode */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b4332]">
              <Users className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>3. المستهدفين وحالة التنفيذ</span>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl text-[11px] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">الفئة المستهدفة:</span>
                  <span className="font-semibold text-slate-800">{request.targetAudience || 'الطلاب والطالبات'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">النوع / الجنس:</span>
                  <span className="font-semibold text-slate-800">{request.targetGender || 'الجنسين (ذكر وأنثى)'}</span>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="text-slate-400 block text-[10px]">حالة النشاط ومقره:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-md ${
                    request.deliveryMode === 'عن بعد'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {request.deliveryMode === 'عن بعد' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {request.deliveryMode || 'عن بعد'}
                  </span>
                  <span className="font-medium text-slate-700">
                    {request.deliveryMode === 'عن بعد'
                      ? (request.meetingUrl ? (
                          <a
                            href={request.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:underline flex items-center gap-1 text-[10px]"
                          >
                            <span>{request.meetingUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : 'رابط الجلسة الافتراضية (Blackboard)')
                      : (request.physicalLocation || request.location || 'مدرج الكلية التطبيقية')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Administrative & Summary */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b4332]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>4. الموافقات والارتباطات الإدارية وملخص النشاط</span>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl text-[11px] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">مركز التعاون والشراكات:</span>
                  <span className="font-semibold text-slate-800">{request.partnershipApproval || 'لا تحتاج إلى موافقة'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">رقم المعاملة (الاتصالات الإدارية):</span>
                  <span className="font-semibold text-slate-800">{request.transactionNumber || 'غير محدد / غير مطلوب'}</span>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="text-slate-400 block text-[10px]">ملخص النشاط والأهداف:</span>
                <p className="mt-1 text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                  {request.summary || 'استيفاء متطلبات خطة الأنشطة المعتمدة وتوثيق ساعات الطلاب في منصة ارتقاء'}
                </p>
              </div>
            </div>
          </div>

          {/* Group 5: Administrative Lifecycle & Audit Trail */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b4332]">
              <History className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>5. السجل والتاريخ الإداري لسير المعاملة</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl text-[11px] space-y-2.5 border border-slate-200/70">
              {/* Milestone 1: Submitter */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">1. تقديم الاستمارة الرسمية</span>
                    <span className="text-[10px] text-slate-500">{request.startDate || request.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    تم رفع الاستمارة بواسطة: {request.presenter} ({request.unit || 'الكلية التطبيقية'})
                  </p>
                </div>
              </div>

              {/* Milestone 2: Direct Manager */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'pending_manager' || request.status === 'returned_manager'
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200'
                      : request.status === 'returned_emp' || request.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#1b4332] text-[#e6c566]'
                  }`}
                >
                  {request.status === 'pending_manager' || request.status === 'returned_manager' ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : request.status === 'returned_emp' || request.status === 'rejected' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">2. مراجعة واعتماد المدير المباشر</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'pending_manager'
                        ? 'قيد الانتظار'
                        : request.status === 'returned_emp'
                        ? 'مُسترجع للموظف'
                        : 'معتمد'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'pending_manager'
                      ? 'الطلب بانتظار إجراء المدير المباشر للبرامج والتدريب.'
                      : request.status === 'returned_emp'
                      ? `تم الإرجاع بملاحظة: "${request.note}"`
                      : 'تمت مراجعة ملاءمة النشاط واعتماده بنجاح وإحالته لقسم التدقيق.'}
                  </p>
                </div>
              </div>

              {/* Milestone 3: Auditor & Dean */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'pending_auditor'
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200 animate-pulse'
                      : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">3. التدقيق والاعتماد النهائي (رئيس الكلية)</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'pending_auditor'
                        ? 'قيد التدقيق'
                        : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                        ? 'معتمد نهائياً'
                        : 'مرحلة لاحقة'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'pending_auditor'
                      ? 'المعاملة قيد مراجعة الضوابط والشراكات من قِبل مسؤول التدقيق.'
                      : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                      ? 'تم التحقق من الضوابط الأكاديمية واعتماد ساعات النشاط رسمياً.'
                      : 'تتطلب موافقة المدير المباشر أولاً.'}
                  </p>
                </div>
              </div>

              {/* Milestone 4: Irtqaa Upload */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'uploaded_irtqaa'
                      ? 'bg-[#1b4332] text-[#e6c566] ring-2 ring-[#c59b27]'
                      : request.status === 'approved_final'
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">4. الرفع إلى منصة ارتقاء الرسمية</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'uploaded_irtqaa'
                        ? 'مكتمل ومرفوع'
                        : request.status === 'approved_final'
                        ? 'جاهز للرفع'
                        : 'قيد الإجراء'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'uploaded_irtqaa'
                      ? 'تمت المزامنة بنجاح في السجل المهاري للطلاب على منصة ارتقاء.'
                      : request.status === 'approved_final'
                      ? 'الطلب جاهز لدى مسؤول المنصة للرفع الفوري.'
                      : 'في انتظار اكتمال الموافقات السابقة.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black active:scale-95 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
