import React, { useState } from 'react';
import { UserRole } from '../types';
import { Landmark, ArrowLeft, Lock, User, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: (role: Exclude<UserRole, 'login'>) => void;
}

export const LoginView: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('4412098');
  const [password, setPassword] = useState('123456');
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'login'>>('emp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const roleOptions: { key: Exclude<UserRole, 'login'>; label: string; desc: string }[] = [
    { key: 'emp', label: '1️⃣ موظف (مقدم الطلب)', desc: 'رفع استمارة نشاط ومتابعة حالة الطلب' },
    { key: 'manager', label: '2️⃣ المدير المباشر', desc: 'مراجعة أولية واعتماد أو إرجاع بملاحظة' },
    { key: 'auditor', label: '3️⃣ موظف التدقيق والاعتماد', desc: 'مراجعة الضوابط واعتماد عميد الكلية' },
    { key: 'uploader', label: '4️⃣ موظف الرفع لمنصة ارتقاء', desc: 'استيفاء البيانات وتأكيد الرفع النهائي' },
  ];

  return (
    <div className="py-6 px-3 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#1b4332] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1b4332]/20 mb-3 border border-[#1b4332]">
        <div className="w-8 h-8 border-4 border-[#c59b27] rounded-full"></div>
      </div>

      <h2 className="text-xl font-extrabold text-[#1b4332] tracking-tight mb-1">
        الكلية التطبيقية
      </h2>
      <p className="text-xs text-gray-500 font-medium mb-6">
        منظومة إدارة واعتماد الأنشطة والدورات ومواءمة منصة ارتقاء
      </p>

      <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-right">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>الرقم الوظيفي / اسم المستخدم</span>
              <User className="w-3.5 h-3.5 text-gray-400" />
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل الرقم الوظيفي..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>كلمة المرور</span>
              <Lock className="w-3.5 h-3.5 text-gray-400" />
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
              <span>الصفة / الدور الوظيفي للمحاكاة</span>
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Exclude<UserRole, 'login'>)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-bold text-gray-800"
            >
              {roleOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/20 transition cursor-pointer mt-2"
          >
            <span>تسجيل الدخول للنظام</span>
            <ArrowLeft className="w-4 h-4 text-[#e6c566]" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center mb-2">الدخول السريع بحسب الصلاحية:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {roleOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onLogin(opt.key)}
                className="text-[11px] p-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-green-50 hover:text-[#1b4332] hover:border-[#1b4332]/30 transition text-center font-bold text-gray-700 cursor-pointer"
              >
                {opt.label.split(' ')[1]} {opt.label.split(' ')[2] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
