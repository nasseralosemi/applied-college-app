import React, { useState, useEffect } from 'react';
import { ActivityRequest } from '../types';
import {
  X,
  Save,
  Edit3,
  Calendar,
  Clock,
  Building2,
  Users,
  MapPin,
  Globe,
  FileText,
  Briefcase,
  AlertCircle,
  AlertTriangle,
  Check,
  Send,
  RotateCcw,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRequest: ActivityRequest) => void;
  mode?: 'auditor' | 'employee_resubmit';
}

const ACTIVITY_TYPES = [
  'ورشة عمل',
  'زيارة',
  'معرض',
  'مجتمعي',
  'دورة',
  'ملتقى',
  'نشاط طلابي',
];

const UNITS = [
  'وحدة شؤون الطلاب',
  'قسم تقنية المعلومات',
  'قسم إدارة الأعمال',
  'وحدة التطوير والجودة',
  'وحدة التدريب والشراكات',
  'وحدة العلاقات العامة والإعلام',
  'وحدة الأنشطة الطلابية والرياضية',
];

const BRANCHES = [
  'فرع الزلفي - شطر الطلاب',
  'فرع الزلفي - شطر الطالبات',
  'فرع المجمعة - شطر الطلاب',
  'فرع المجمعة - شطر الطالبات',
  'فرع رماح - شطر الطلاب',
  'فرع رماح - شطر الطالبات',
];

export const EditActivityModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
  onSave,
  mode,
}) => {
  if (!isOpen || !request) return null;

  const [formData, setFormData] = useState<ActivityRequest>({ ...request });

  useEffect(() => {
    if (request) {
      setFormData({ ...request });
    }
  }, [request]);

  const handleChange = (field: keyof ActivityRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEmployeeMode = mode === 'employee_resubmit' || request.status === 'returned_emp';

  const prepareData = (): ActivityRequest => {
    const hoursNum = Number(formData.hours) || 1;
    return {
      ...formData,
      hours: hoursNum,
      editedAfterReturn: true,
      date: formData.startDate || formData.date,
      location:
        formData.deliveryMode === 'عن بعد'
          ? formData.meetingUrl?.trim()
            ? `عن بعد - ${formData.meetingUrl.trim()}`
            : 'عن بعد'
          : formData.physicalLocation?.trim() || formData.location || 'حضوري',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prepareData());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-slide-up font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5 justify-end">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isEmployeeMode
                      ? 'bg-rose-100 text-rose-900 border-rose-200'
                      : 'bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  {isEmployeeMode ? 'مقدم الطلب • استيفاء الملاحظات' : 'صلاحية التدقيق'}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#46523B]">
                  {isEmployeeMode ? 'تعديل بيانات الاستمارة المسترجعة' : 'تعديل ومراجعة حقول الاستمارة'}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                {isEmployeeMode
                  ? 'تعديل البيانات المطلوبة (مثل الساعات المعتمدة أو اسم النشاط) بناءً على ملاحظة المدير'
                  : 'تعديل وتصحيح بيانات النشاط قبل الاعتماد والتحويل لمنصة ارتقاء'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-[#46523B] text-[#C4B688] flex items-center justify-center shadow-md shadow-[#46523B]/20">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {/* Prominent Manager Return Note Notice if Returned */}
          {request.note && isEmployeeMode && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 sm:p-4 text-rose-950 space-y-2 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-black text-rose-900">
                    ملاحظة وتوجيه المدير المباشر للتعديل:
                  </span>
                </div>
                <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2.5 py-0.5 rounded-full">
                  مطلوب الاستيفاء
                </span>
              </div>
              <div className="bg-white/95 p-3 rounded-xl border border-rose-200 text-xs font-bold text-slate-900 leading-relaxed">
                "{request.note}"
              </div>
              <p className="text-[10px] text-rose-700 font-medium">
                يرجى تعديل الحقول الخاطئة أدناه وفق توجيه المدير أعلاه، ثم حفظ التعديلات وإعادة الرفع.
              </p>
            </div>
          )}

          {/* Group 1: Basic Information */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#46523B]">
              <FileText className="w-4 h-4 text-[#A08D52]" />
              <span>1. البيانات الأساسية ونوع النشاط</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع النشاط <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مقدم النشاط (الجهة المنفذة) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.presenter}
                  onChange={(e) => handleChange('presenter', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  منسق النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.coordinatorName}
                  onChange={(e) => handleChange('coordinatorName', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الوحدة المشرفة
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الفرع والشطر
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: Schedule & Hours */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#46523B]">
              <Calendar className="w-4 h-4 text-[#A08D52]" />
              <span>2. التوقيت والمواعيد والساعات التدريبية</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تاريخ بداية النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تاريخ نهاية النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  وقت البداية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  placeholder="مثال: 10:00 ص"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عدد الساعات <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Execution Mode & Target */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#46523B]">
              <Users className="w-4 h-4 text-[#A08D52]" />
              <span>3. المستهدفون وحالة التنفيذ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الفئة المستهدفة
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  النوع
                </label>
                <select
                  value={formData.targetGender}
                  onChange={(e) => handleChange('targetGender', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  <option value="الجنسين (ذكر وأنثى)">الجنسين (ذكر وأنثى)</option>
                  <option value="ذكر (شطر الطلاب)">ذكر (شطر الطلاب)</option>
                  <option value="أنثى (شطر الطالبات)">أنثى (شطر الطالبات)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  حالة النشاط
                </label>
                <select
                  value={formData.deliveryMode}
                  onChange={(e) =>
                    handleChange('deliveryMode', e.target.value as 'عن بعد' | 'حضوري')
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  <option value="عن بعد">عن بعد</option>
                  <option value="حضوري">حضوري</option>
                </select>
              </div>
            </div>

            {formData.deliveryMode === 'عن بعد' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط النشاط (عن بعد)
                </label>
                <input
                  type="url"
                  value={formData.meetingUrl || ''}
                  onChange={(e) => handleChange('meetingUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none font-mono text-left"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  موقع النشاط (حضوري)
                </label>
                <input
                  type="text"
                  value={formData.physicalLocation || ''}
                  onChange={(e) => handleChange('physicalLocation', e.target.value)}
                  placeholder="مثال: مدرج الكلية التطبيقية الرئيسي"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
                />
              </div>
            )}
          </div>

          {/* Group 4: Administrative Details & Summary */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#46523B]">
              <Briefcase className="w-4 h-4 text-[#A08D52]" />
              <span>4. الشراكات والملخص</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مركز التعاون والشراكات
                </label>
                <select
                  value={formData.partnershipApproval}
                  onChange={(e) =>
                    handleChange(
                      'partnershipApproval',
                      e.target.value as 'لا تحتاج إلى موافقة' | 'تتطلب موافقة'
                    )
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none cursor-pointer"
                >
                  <option value="لا تحتاج إلى موافقة">لا تحتاج إلى موافقة</option>
                  <option value="تتطلب موافقة">تتطلب موافقة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم المعاملة (إن وجد)
                </label>
                <input
                  type="text"
                  value={formData.transactionNumber || ''}
                  onChange={(e) => handleChange('transactionNumber', e.target.value)}
                  placeholder="مثال: 44-0982-م"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملخص النشاط والأهداف
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#A08D52] outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#46523B] via-[#384230] to-[#2A3324] text-[#C4B688] font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#46523B]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#A08D52]/30"
            >
              <Save className="w-4 h-4 text-[#C4B688]" />
              <span>حفظ التعديلات في الاستمارة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs active:scale-95 transition-all duration-150 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
