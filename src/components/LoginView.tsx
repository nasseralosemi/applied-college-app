import React, { useState } from 'react';
import { SystemUser } from '../types';
import { Lock, User, ShieldAlert, ArrowLeft, Shield, Building2, KeyRound } from 'lucide-react';

interface Props {
  users: SystemUser[];
  onLoginSuccess: (user: SystemUser) => void;
}

export const LoginView: React.FC<Props> = ({ users, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'admin'>('staff');

  // Staff login fields
  const [staffEmpNum, setStaffEmpNum] = useState('4412098');
  const [staffPassword, setStaffPassword] = useState('123');
  const [staffError, setStaffError] = useState<string | null>(null);

  // Admin login fields
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    const cleanEmpNum = staffEmpNum.trim();
    const user = users.find(
      (u) =>
        (u.employeeNumber.toLowerCase() === cleanEmpNum.toLowerCase() ||
          u.id.toLowerCase() === cleanEmpNum.toLowerCase()) &&
        u.role !== 'admin'
    );

    if (!user) {
      if (cleanEmpNum.toLowerCase() === 'admin') {
        setStaffError('حساب مدير النظام مخصص للتبويب الآخر. يرجى التبديل لتبويب "دخول مدير النظام".');
        return;
      }
      setStaffError('الرقم الوظيفي غير مسجل في النظام. تأكد من الرقم أو راجع مدير النظام.');
      return;
    }

    if (!user.isActive) {
      setStaffError('عذراً، هذا الحساب معطل حالياً من قبل مدير النظام. يرجى التواصل مع الإدارة.');
      return;
    }

    if (user.password && user.password !== staffPassword.trim()) {
      setStaffError('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      return;
    }

    onLoginSuccess(user);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const cleanUsername = adminUsername.trim().toLowerCase();
    const adminUser = users.find(
      (u) =>
        u.role === 'admin' &&
        (u.employeeNumber.toLowerCase() === cleanUsername ||
          u.id.toLowerCase() === cleanUsername ||
          cleanUsername === 'admin')
    );

    if (!adminUser) {
      setAdminError('بيانات مدير النظام غير مطابقة.');
      return;
    }

    if (!adminUser.isActive) {
      setAdminError('حساب مدير النظام غير مفعّل.');
      return;
    }

    if (adminUser.password && adminUser.password !== adminPassword.trim()) {
      setAdminError('كلمة مرور مدير النظام غير صحيحة.');
      return;
    }

    onLoginSuccess(adminUser);
  };

  const fillStaffCreds = (empNum: string, pass: string) => {
    setStaffEmpNum(empNum);
    setStaffPassword(pass);
    setStaffError(null);
  };

  return (
    <div className="py-6 px-2 sm:px-4 flex flex-col items-center justify-center text-center font-['Tajawal',sans-serif]">
      {/* Brand Crest */}
      <div className="w-16 h-16 bg-[#1b4332] rounded-3xl flex items-center justify-center shadow-xl shadow-[#1b4332]/25 mb-3 border-2 border-[#c59b27]/40 ring-4 ring-[#1b4332]/10">
        <div className="w-8 h-8 border-4 border-[#e6c566] rounded-full"></div>
      </div>

      <h2 className="text-xl font-extrabold text-[#1b4332] tracking-tight mb-1">
        الكلية التطبيقية
      </h2>
      <p className="text-xs text-slate-500 font-medium mb-5 max-w-sm">
        بوابة اعتماد وتوثيق الأنشطة والدورات ومواءمة منصة ارتقاء
      </p>

      {/* Login Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-100 text-right animate-fade-slide-up">
        {/* Two Clear Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl mb-5 text-xs font-bold border border-slate-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setStaffError(null);
            }}
            className={`py-2.5 px-2 rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white text-[#1b4332] shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>الموظفون والمسؤولون</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminError(null);
            }}
            className={`py-2.5 px-2 rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#1b4332] text-[#e6c566] shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>مدير النظام (Admin)</span>
          </button>
        </div>

        {/* Tab 1: Staff & Officers Login */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="text-right pb-1">
              <span className="text-xs font-extrabold text-[#1b4332] block">
                دخول الكوادر الأكاديمية والإدارية
              </span>
              <span className="text-[11px] text-slate-400">
                تسجيل الدخول بالرقم الوظيفي المعتمد في الكلية
              </span>
            </div>

            {staffError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2 animate-fade-slide-up">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{staffError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>الرقم الوظيفي</span>
                <User className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="text"
                value={staffEmpNum}
                onChange={(e) => setStaffEmpNum(e.target.value)}
                placeholder="أدخل الرقم الوظيفي..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة المرور</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] hover:opacity-95 text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
            >
              <span>تسجيل الدخول إلى النظام</span>
              <ArrowLeft className="w-4 h-4 text-[#e6c566]" />
            </button>

            {/* Discreet Helper for Easy Evaluation/Testing */}
            <div className="pt-3 border-t border-slate-100 text-right">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500">
                  الحسابات الرسمية المعتمدة (تعبئة سريعة):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">كلمة المرور: 123</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => fillStaffCreds('4412098', '123')}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-right font-medium active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <div className="font-bold text-[#1b4332] truncate">عبدالرحمن الطوالة</div>
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>مقدم الطلب (Employee)</span>
                    <span className="font-mono font-bold text-emerald-800">4412098</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillStaffCreds('4412001', '123')}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-right font-medium active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <div className="font-bold text-[#1b4332] truncate">عمر الخنيني</div>
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>المدير المباشر (Manager)</span>
                    <span className="font-mono font-bold text-emerald-800">4412001</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillStaffCreds('4412002', '123')}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-right font-medium active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <div className="font-bold text-[#1b4332] truncate">وائل العفيصان</div>
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>مدقق الاعتماد (Auditor)</span>
                    <span className="font-mono font-bold text-emerald-800">4412002</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillStaffCreds('4412003', '123')}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-right font-medium active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <div className="font-bold text-[#1b4332] truncate">ناصر العصيمي</div>
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>رافع ارتقاء (Uploader)</span>
                    <span className="font-mono font-bold text-emerald-800">4412003</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: System Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-[#1b4332]/5 p-3 rounded-2xl border border-[#1b4332]/10 text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
                <span className="text-xs font-bold text-[#1b4332]">
                  بوابة إدارة وتكوين النظام المركزية (ناصر العصيمي)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                مخصصة لمدير النظام لإدارة المستخدمين، منح وتعديل الصلاحيات، ومتابعة سير عمل منظومة ارتقاء.
              </p>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2 animate-fade-slide-up">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{adminError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>اسم مستخدم مدير النظام</span>
                <KeyRound className="w-3.5 h-3.5 text-[#c59b27]" />
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (مثل: admin)..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة مرور المسؤول</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] hover:opacity-95 text-[#e6c566] font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
            >
              <Shield className="w-4 h-4 text-[#e6c566]" />
              <span>دخول لوحة تحكم مدير النظام</span>
            </button>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                <span>مدير النظام: <strong className="text-slate-700">ناصر العصيمي</strong> (المستخدم:</span>
                <span className="font-mono font-bold text-slate-700">admin</span> /{' '}
                <span className="font-mono font-bold text-slate-700">admin</span>)
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
