import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Send, User, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  targetRoleLabel?: string;
  allowRoleSelection?: boolean;
  initialRole?: 'emp' | 'manager';
  onConfirm: (note: string, selectedTargetRole?: 'emp' | 'manager') => void;
  onCancel: () => void;
}

export const ReturnNoteModal: React.FC<Props> = ({
  isOpen,
  title,
  targetRoleLabel = 'المدير المباشر',
  allowRoleSelection = false,
  initialRole = 'manager',
  onConfirm,
  onCancel,
}) => {
  const [note, setNote] = useState('');
  const [targetRole, setTargetRole] = useState<'emp' | 'manager'>(initialRole);

  useEffect(() => {
    setTargetRole(initialRole);
    setNote('');
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const presets = [
    'يرجى استيفاء كشف الحضور ورابط الفعالية بدقة.',
    'يرجى تعديل عدد الساعات المعتمدة بما يتوافق مع الدليل التنظيمي.',
    'الرجاء إرفاق موافقة الشراكة المجتمعية المسبقة.',
    'الملخص بحاجة لتوضيح الفئة المستهدفة ومخرجات الدورة.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onConfirm(note.trim(), targetRole);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-slide-up font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-5 sm:p-6 border border-slate-100 text-right">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer active:scale-95 transition-all duration-150"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#1b4332] font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-[#c59b27]" />
            <span>{title}</span>
          </div>
        </div>

        {/* Target Destination Switcher (if allowed) */}
        {allowRoleSelection ? (
          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              جهة إرجاع الطلب:
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTargetRole('manager')}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                  targetRole === 'manager'
                    ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>المدير المباشر</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetRole('emp')}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                  targetRole === 'emp'
                    ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>مقدم الطلب (الموظف)</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            يرجى تدوين سبب الإرجاع والملاحظة التوجيهية إلى{' '}
            <span className="font-bold text-slate-900">({targetRoleLabel})</span>:
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
            placeholder="اكتب سبب الإرجاع هنا بالتفصيل..."
            className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:border-[#c59b27] outline-none transition bg-slate-50/70"
            autoFocus
          />

          <div className="mt-2 mb-4">
            <p className="text-[10px] text-slate-400 mb-1.5 font-bold">ملاحظات شائعة سريعة:</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNote(p)}
                  className="text-[10px] bg-slate-50 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-xl px-2.5 py-1 text-right active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!note.trim()}
              className="flex-1 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] hover:opacity-95 disabled:opacity-50 text-[#e6c566] font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
            >
              <Send className="w-3.5 h-3.5 text-[#e6c566]" />
              <span>إرسال الملاحظة والإرجاع</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs active:scale-95 transition-all duration-150 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
