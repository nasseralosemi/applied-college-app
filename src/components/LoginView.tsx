import React, { useState } from 'react';
import { SystemUser } from '../types';
import { MajmaahLogo } from './MajmaahLogo';
import {
  Lock,
  User,
  ShieldAlert,
  ArrowLeft,
  Shield,
  Building2,
  Eye,
  EyeOff,
  Crown,
  Award,
  Megaphone,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  users: SystemUser[];
  onLoginSuccess: (user: SystemUser) => void;
}

export const LoginView: React.FC<Props> = ({ users, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'admin'>('staff');

  // Staff login fields
  const [staffEmpNum, setStaffEmpNum] = useState('4412098');
  const [staffPassword, setStaffPassword] = useState('123');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Admin login fields
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleStaffSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStaffError(null);

    const cleanEmpNum = staffEmpNum.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.employeeNumber.toLowerCase() === cleanEmpNum ||
          u.id.toLowerCase() === cleanEmpNum ||
          (cleanEmpNum === 'pr' && u.role === 'pr') ||
          (cleanEmpNum === 'dean' && u.role === 'dean') ||
          (cleanEmpNum === 'bayan' && u.role === 'accreditation') ||
          (cleanEmpNum === 'accreditation' && u.role === 'accreditation')) &&
        u.role !== 'admin'
    );

    if (!user) {
      if (cleanEmpNum.toLowerCase() === 'admin') {
        setStaffError('حساب مدير النظام مخصص للتبويب الآخر. يرجى التبديل لتبويب "دخول مدير النظام".');
        return;
      }
      setStaffError('اسم المستخدم غير مسجل في النظام. تأكد من صحة البيانات أو راجع مدير النظام.');
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

  const handleAdminSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const selectAccount = (empNum: string, pass: string, role?: string) => {
    if (role === 'admin') {
      setActiveTab('admin');
      setAdminUsername(empNum);
      setAdminPassword(pass);
      setAdminError(null);
    } else {
      setActiveTab('staff');
      setStaffEmpNum(empNum);
      setStaffPassword(pass);
      setStaffError(null);
    }
  };

  const quickAccounts = [
    {
      name: 'عبدالرحمن الطوالة',
      roleTitle: 'مقدم الطلب',
      empNum: '4412098',
      role: 'emp',
      icon: User,
    },
    {
      name: 'عمر الخنيني',
      roleTitle: 'المدير المباشر',
      empNum: '4412001',
      role: 'manager',
      icon: Building2,
    },
    {
      name: 'وائل العفيصان',
      roleTitle: 'مدقق الاعتماد',
      empNum: '4412002',
      role: 'auditor',
      icon: FileCheck2,
    },
    {
      name: 'ناصر العصيمي',
      roleTitle: 'رافع ارتقاء',
      empNum: '4412003',
      role: 'uploader',
      icon: CheckCircle2,
    },
    {
      name: 'العلاقات العامة',
      roleTitle: 'منصة X والإعلام',
      empNum: '4412004',
      role: 'pr',
      icon: Megaphone,
    },
    {
      name: 'بيان الطيار',
      roleTitle: 'موظف الاعتمادات',
      empNum: '4412005',
      role: 'accreditation',
      icon: Award,
    },
    {
      name: 'رئيس الكلية',
      roleTitle: 'القيادة التنفيذية',
      empNum: '4412000',
      role: 'dean',
      icon: Crown,
    },
    {
      name: 'مدير النظام',
      roleTitle: 'الإدارة الكاملة',
      empNum: 'admin',
      role: 'admin',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-6 flex flex-col items-center justify-center font-['Tajawal',sans-serif] text-slate-800 bg-[#FAF9F6] selection:bg-[#46523B] selection:text-white relative overflow-hidden">
      {/* Subtle Institutional Geometric Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(70, 82, 59, 0.12) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft Ambient Radial Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#A08D52]/10 via-[#46523B]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#A08D52]/8 rounded-full blur-2xl" />
      </div>

      {/* 1. Official Institutional Header & Logo (جامعة المجمعة - الكلية التطبيقية) */}
      <div className="flex flex-col items-center text-center mb-6 space-y-2.5">
        <div className="p-3 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(70,82,59,0.08)] border border-[#46523B]/12">
          <MajmaahLogo size="lg" showSubtitle={true} />
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#A08D52] px-3.5 py-1 rounded-full bg-white border border-[#A08D52]/30 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#A08D52]" />
          <span>منظومة اعتماد وتوثيق الأنشطة والفعاليات</span>
        </div>

        <p className="text-xs sm:text-sm text-[#5C6753] font-medium max-w-sm mx-auto leading-relaxed">
          بوابة التوثيق والمواءمة مع منصة ارتقاء والسجل المهاري الوطني
        </p>
      </div>

      {/* 2. Floating Main Card with rounded-[32px] and Soft Shadow */}
      <div className="w-full max-w-lg relative">
        <div className="relative w-full bg-white rounded-[32px] p-5 sm:p-7 shadow-[0_12px_40px_rgba(70,82,59,0.08)] border border-[#46523B]/12 text-right">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF9F6] rounded-2xl mb-5 text-xs font-bold border border-[#46523B]/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('staff');
                setStaffError(null);
              }}
              className={`py-2.5 px-3 rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/20 font-black'
                  : 'text-slate-600 hover:text-[#46523B]'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'staff' ? 'text-[#A08D52]' : 'text-slate-400'}`} />
              <span>الموظفون والمسؤولون</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setAdminError(null);
              }}
              className={`py-2.5 px-3 rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/20 font-black'
                  : 'text-slate-600 hover:text-[#46523B]'
              }`}
            >
              <Shield className={`w-4 h-4 ${activeTab === 'admin' ? 'text-[#A08D52]' : 'text-slate-400'}`} />
              <span>مدير النظام (Admin)</span>
            </button>
          </div>

          {/* TAB 1: STAFF & OFFICERS LOGIN */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              {staffError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center gap-2.5 shadow-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-semibold leading-relaxed">{staffError}</span>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-[#46523B] mb-1.5">
                  الرقم الوظيفي / اسم المستخدم
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={staffEmpNum}
                    onChange={(e) => setStaffEmpNum(e.target.value)}
                    placeholder="أدخل الرقم الوظيفي..."
                    required
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-[#FAF9F6] focus:bg-white focus:border-[#46523B] focus:ring-4 focus:ring-[#46523B]/10 outline-none transition-all duration-150"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#46523B]">
                    كلمة المرور
                  </label>
                  <span className="text-[10px] text-[#A08D52] font-mono bg-[#A08D52]/10 px-2 py-0.5 rounded-lg border border-[#A08D52]/20 font-bold">
                    الافتراضي: 123
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full pr-11 pl-11 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-[#FAF9F6] focus:bg-white focus:border-[#46523B] focus:ring-4 focus:ring-[#46523B]/10 outline-none transition-all duration-150"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
                    title={showStaffPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#46523B] hover:bg-[#384230] text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-[#46523B]/20 active:scale-[0.98] transition-all duration-150 cursor-pointer border border-[#A08D52]/30"
              >
                <span className="text-white">تسجيل الدخول إلى النظام</span>
                <ArrowLeft className="w-4 h-4 text-[#A08D52]" />
              </button>
            </form>
          )}

          {/* TAB 2: ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {adminError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center gap-2.5 shadow-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-semibold leading-relaxed">{adminError}</span>
                </div>
              )}

              {/* Admin Username */}
              <div>
                <label className="block text-xs font-bold text-[#46523B] mb-1.5">
                  اسم مستخدم مدير النظام
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-[#FAF9F6] focus:bg-white focus:border-[#46523B] focus:ring-4 focus:ring-[#46523B]/10 outline-none transition-all duration-150"
                  />
                  <Shield className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#46523B]">
                    كلمة المرور
                  </label>
                  <span className="text-[10px] text-[#A08D52] font-mono bg-[#A08D52]/10 px-2 py-0.5 rounded-lg border border-[#A08D52]/20 font-bold">
                    الافتراضي: admin
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full pr-11 pl-11 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-[#FAF9F6] focus:bg-white focus:border-[#46523B] focus:ring-4 focus:ring-[#46523B]/10 outline-none transition-all duration-150"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Admin Button */}
              <button
                type="submit"
                className="w-full bg-[#A08D52] hover:bg-[#8D7B43] text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-[#A08D52]/20 active:scale-[0.98] transition-all duration-150 cursor-pointer border border-[#A08D52]"
              >
                <span>دخول لوحة التحكم الإدارية</span>
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
            </form>
          )}

          {/* 3. Horizontal Chips Slider for Quick Official Accounts (سلايدر أفقي مرن وسريع) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#A08D52]" />
                <span className="text-xs font-black text-[#46523B]">
                  تسجيل الدخول السريع بالحسابات الرسمية:
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">مرر أفقياً</span>
            </div>

            {/* Horizontal Scrollable Chips Container */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 snap-x scroll-smooth">
              {quickAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected =
                  acc.role === 'admin'
                    ? activeTab === 'admin' && adminUsername === acc.empNum
                    : activeTab === 'staff' && staffEmpNum === acc.empNum;

                return (
                  <button
                    key={acc.empNum}
                    type="button"
                    onClick={() => {
                      selectAccount(
                        acc.empNum,
                        acc.role === 'admin' ? 'admin' : '123',
                        acc.role
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl shrink-0 snap-start transition-all duration-150 cursor-pointer border text-right select-none ${
                      isSelected
                        ? 'bg-[#46523B] text-white border-[#A08D52] shadow-sm ring-2 ring-[#A08D52]/30'
                        : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-[#46523B]/30 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-[#A08D52]' : 'bg-slate-100 text-[#46523B]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className={`text-[11px] font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {acc.name}
                      </span>
                      <span className={`text-[9px] truncate ${isSelected ? 'text-[#C4B688]' : 'text-[#A08D52]'}`}>
                        {acc.roleTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-[#5C6753]/80 space-y-1">
        <p>جامعة المجمعة • عمادة الكلية التطبيقية • الربط السحابي المباشر</p>
        <p className="text-[10px] font-mono text-slate-400">إصدار 2.5 • بيئة الرفع والاعتماد الآمنة</p>
      </div>
    </div>
  );
};

export default LoginView;
