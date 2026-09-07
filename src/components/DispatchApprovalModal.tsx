import React, { useState, useEffect } from 'react';
import { ActivityRequest } from '../types';
import {
  X,
  Send,
  UserCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Share2,
  FileEdit,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch: (payload: {
    requestId: number;
    assignedUploader: string;
    xPlatformPublish: boolean;
    uploaderInstructions: string;
  }) => void;
}

const UPLOADER_ASSIGNEES = [
  {
    id: 'official_uploader',
    title: 'مسؤول الرفع والتوثيق لمنصة ارتقاء (ناصر العصيمي - #4412003)',
    recommendedFor: ['نشاط طلابي', 'ورشة عمل', 'دورة', 'ملتقى', 'مجتمعي', 'زيارة', 'معرض'],
    roleDesc: 'المسؤول الرسمي المعتمد لرفع وتوثيق الأنشطة ومواءمتها مع منصة ارتقاء',
  },
  {
    id: 'courses',
    title: 'مسؤول مسار الدورات التدريبية (وحدة التدريب)',
    recommendedFor: ['دورة'],
    roleDesc: 'مختص بمراجعة ساعات الدورات والشهادات المعتمدة',
  },
  {
    id: 'student_activities',
    title: 'مسؤول مسار الأنشطة الطلابية (شؤون الطلاب)',
    recommendedFor: ['نشاط طلابي'],
    roleDesc: 'مختص بالأنشطة والمسابقات والفعاليات غير الصفية',
  },
  {
    id: 'workshops',
    title: 'مسؤول مسار الورش والملتقيات (التطوير والجودة)',
    recommendedFor: ['ورشة عمل', 'ملتقى'],
    roleDesc: 'مختص بالندوات والورش التخصصية والملتقيات',
  },
];

export const DispatchApprovalModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
  onConfirmDispatch,
}) => {
  if (!isOpen || !request) return null;

  // Compute smart recommendation based on activity type
  const getSmartAssignee = (type: string) => {
    const match = UPLOADER_ASSIGNEES.find((item) =>
      item.recommendedFor.includes(type)
    );
    return match ? match.title : UPLOADER_ASSIGNEES[0].title;
  };

  const [assignedUploader, setAssignedUploader] = useState<string>(
    request.assignedUploader || getSmartAssignee(request.type)
  );
  const [xPlatformPublish, setXPlatformPublish] = useState<boolean>(
    request.xPlatformPublish !== undefined ? request.xPlatformPublish : true
  );
  const [uploaderInstructions, setUploaderInstructions] = useState<string>(
    request.uploaderInstructions || ''
  );

  useEffect(() => {
    if (request) {
      setAssignedUploader(
        request.assignedUploader || getSmartAssignee(request.type)
      );
      setXPlatformPublish(
        request.xPlatformPublish !== undefined ? request.xPlatformPublish : true
      );
      setUploaderInstructions(request.uploaderInstructions || '');
    }
  }, [request]);

  const presetInstructions = [
    'مطابقة كشف الحضور مع عدد الساعات المعتمدة في الاستمارة بدقة.',
    'التأكد من إدراج روابط التقييم واستبانات قياس الأثر.',
    'الرفع على منصة ارتقاء خلال مدة أقصاها 48 ساعة من تاريخ التنفيذ.',
    'إشعار منسق النشاط فور اكتمال التوثيق في السجل المهاري.',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispatch({
      requestId: request.id,
      assignedUploader,
      xPlatformPublish,
      uploaderInstructions: uploaderInstructions.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-slide-up font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col border border-slate-100 overflow-hidden text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-amber-50/40 to-slate-50">
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  الخطوة النهائية
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#1b4332]">
                  التوجيه الذكي وتعيين المسؤول المختص
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                اعتماد النشاط وتوجيهه للمسؤول الميداني للرفع إلى منصة ارتقاء
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center shadow-md shadow-[#1b4332]/25">
              <Send className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {/* Activity Brief Card */}
          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {request.type}
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">
                {request.name}
              </h4>
              <p className="text-[10px] text-slate-500">
                {request.presenter} • {request.hours} ساعات معتمدة
              </p>
            </div>
            <div className="text-left shrink-0">
              {request.deanApproved ? (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>معتمد من رئيس الكلية</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>مكتمل الضوابط الأكاديمية</span>
                </span>
              )}
            </div>
          </div>

          {/* Section 1: Select Assignee (قائمة اختيار الموظف المكلف بالرفع) */}
          <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4332]">
                <UserCheck className="w-4 h-4 text-[#c59b27]" />
                <span>1. الموظف المكلف بالرفع لمنصة ارتقاء (Select Assignee)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>توجيه ذكي بحسب مسار النشاط</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              حدد المسؤول المختص بمواءمة وإدخال سجلات المتدربين بحسب المسار الإداري للنشاط:
            </p>

            <div className="space-y-1.5 pt-1">
              {UPLOADER_ASSIGNEES.map((assignee) => {
                const isSelected = assignedUploader === assignee.title;
                const isRecommended = assignee.recommendedFor.includes(request.type);

                return (
                  <label
                    key={assignee.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer active:scale-95 transition-all duration-150 ${
                      isSelected
                        ? 'bg-white border-[#1b4332] shadow-sm ring-1 ring-[#1b4332]'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignee"
                      checked={isSelected}
                      onChange={() => setAssignedUploader(assignee.title)}
                      className="mt-0.5 accent-[#1b4332] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#1b4332]' : 'text-slate-800'
                          }`}
                        >
                          {assignee.title}
                        </span>
                        {isRecommended && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-bold">
                            موصى به لنشاط ({request.type})
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {assignee.roleDesc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Media & X Platform Toggle (خيارات النشر الإعلامي) */}
          <div className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4332]">
              <Share2 className="w-4 h-4 text-[#c59b27]" />
              <span>2. خيارات النشر والتغطية الإعلامية (منصة X)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    النشر والإعلان الرسمي في حساب الكلية (منصة X)
                  </span>
                  <span className="text-[10px] bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded">
                    X
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {xPlatformPublish
                    ? 'سيتم تزويد وحدة العلاقات العامة ببطاقة الفعالية للإعلان والتغطية'
                    : 'توثيق داخلي في منصة ارتقاء بدون حملة إعلانية خارجية'}
                </p>
              </div>

              {/* Custom Switch Toggle */}
              <button
                type="button"
                onClick={() => setXPlatformPublish(!xPlatformPublish)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-200 cursor-pointer ${
                  xPlatformPublish ? 'bg-[#1b4332] justify-start' : 'bg-slate-300 justify-end'
                }`}
              >
                <div className="bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-200 flex items-center justify-center">
                  {xPlatformPublish ? (
                    <span className="text-[10px] font-bold text-[#1b4332]">✓</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">✕</span>
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-medium px-2 py-1 rounded-lg">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  xPlatformPublish ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              <span className={xPlatformPublish ? 'text-emerald-800 font-bold' : 'text-slate-500'}>
                الحالة المحددة:{' '}
                {xPlatformPublish
                  ? 'يتطلب إعلان رسمي في منصة X'
                  : 'بدون إعلان (سجل مهاري فقط)'}
              </span>
            </div>
          </div>

          {/* Section 3: Instructions & Notes (مربع التعليمات والتوجيهات) */}
          <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4332]">
              <FileEdit className="w-4 h-4 text-[#c59b27]" />
              <span>3. التعليمات والتوجيهات للموظف المكلف بالرفع (Notes)</span>
            </div>

            <textarea
              value={uploaderInstructions}
              onChange={(e) => setUploaderInstructions(e.target.value)}
              rows={3}
              placeholder="اكتب أية تعليمات إضافية للموظف المكلف (مثلاً: التحقق من كشف الحضور، مطابقة الساعات، إلخ)..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] outline-none"
            />

            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-1.5">
                قوالب توجيهية سريعة (انقر للإضافة):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presetInstructions.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUploaderInstructions((prev) =>
                        prev ? `${prev}\n- ${text}` : text
                      );
                    }}
                    className="text-[10px] bg-white hover:bg-amber-50 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-lg px-2 py-1 text-right active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    + {text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
            >
              <Send className="w-4 h-4 text-[#e6c566]" />
              <span>تأكيد الاعتماد النهائي وتوجيه الطلب</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs active:scale-95 transition-all duration-150 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
