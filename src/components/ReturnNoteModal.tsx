import React, { useState } from 'react';
import { AlertCircle, X, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  targetRoleLabel: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export const ReturnNoteModal: React.FC<Props> = ({
  isOpen,
  title,
  targetRoleLabel,
  onConfirm,
  onCancel,
}) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const presets = [
    'يرجى استيفاء كشف الحضور ورابط الفعالية بدقة.',
    'يرجى تعديل عدد الساعات المعتمدة بما يتوافق مع الدليل.',
    'الرجاء إرفاق موافقة الشراكة المجتمعية المسبقة.',
    'الملخص بحاجة لتوضيح الفئة المستهدفة ومخرجات الدورة.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onConfirm(note.trim());
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-5 border border-gray-100 text-right animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#1b4332] font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-[#c59b27]" />
            <span>{title}</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          يرجى تدوين سبب الإرجاع والملاحظة التوجيهية إلى <span className="font-bold text-gray-900">({targetRoleLabel})</span>:
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
            placeholder="اكتب سبب الإرجاع هنا بالتفصيل..."
            className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:border-[#c59b27] outline-none transition bg-gray-50/70"
            autoFocus
          />

          <div className="mt-2 mb-4">
            <p className="text-[10px] text-gray-400 mb-1.5 font-bold">ملاحظات شائعة سريعة:</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNote(p)}
                  className="text-[10px] bg-gray-50 hover:bg-amber-50 hover:text-amber-900 border border-gray-200 hover:border-amber-300 rounded-xl px-2.5 py-1 transition text-right cursor-pointer"
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
              className="flex-1 bg-[#1b4332] hover:bg-[#143728] disabled:opacity-50 text-[#e6c566] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#e6c566]" />
              <span>إرسال الملاحظة والإرجاع</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
