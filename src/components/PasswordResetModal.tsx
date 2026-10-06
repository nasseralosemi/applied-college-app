import React, { useState, useEffect } from 'react';
import { SystemUser } from '../types';
import { KeyRound, Copy, Check, RefreshCw, X, ShieldAlert, Lock } from 'lucide-react';

interface Props {
  user: SystemUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newPass: string) => void;
}

const generateTemporaryPassword = (): string => {
  const prefixes = ['Irtqaa', 'MU-Pass', 'Acad', 'Univ'];
  const symbols = ['@', '#', '$', '!'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${randomPrefix}${randomSymbol}${randomDigits}`;
};

export const PasswordResetModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const generated = generateTemporaryPassword();
      setPassword(generated);
      setCopied(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleGenerateNew = () => {
    const generated = generateTemporaryPassword();
    setPassword(generated);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onConfirm(user.id, password.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold shadow-sm">
              <KeyRound className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1b4332]">
                إعادة تعيين كلمة المرور
              </h3>
              <p className="text-[11px] text-slate-500">
                توليد كلمة مرور مؤقتة وتعيينها للمستخدم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User context note */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold">المستخدم المستهدف:</span>
            <span className="font-extrabold text-slate-900">{user.name}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-slate-400">الرقم الوظيفي:</span>
            <span className="font-mono font-bold text-[#1b4332]">#{user.employeeNumber}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Generated Password Display Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>كلمة المرور المؤقتة المولدة:</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateNew}
                className="text-[11px] font-bold text-[#1b4332] hover:text-[#c59b27] flex items-center gap-1 cursor-pointer transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>توليد أخرى</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-24 pr-4 py-3 text-sm rounded-2xl border-2 border-amber-300 bg-amber-50/50 focus:bg-white focus:border-[#c59b27] outline-none transition font-mono font-bold text-slate-900 tracking-wider text-left"
                dir="ltr"
              />

              <button
                type="button"
                onClick={handleCopy}
                className={`absolute left-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1b4332] hover:bg-[#143728] text-[#e6c566]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              يمكنك نسخ كلمة المرور ومشاركتها مع الموظف لتسجيل الدخول الفوري.
            </p>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              عند الضغط على <strong>تأكيد وتعيين كلمة المرور</strong>، سيتم تحديث كلمة مرور الحساب فوراً ليتمكن المستخدم من تسجيل الدخول ببياناته الجديدة.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#1b4332] to-[#143728] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#1b4332]/25 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-[#e6c566]" />
              <span>تأكيد وتعيين كلمة المرور</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
