import React, { useState } from 'react';
import { SystemUser } from '../types';
import {
  Lock,
  User,
  ShieldAlert,
  ArrowLeft,
  Shield,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  Crown,
  Award,
  Megaphone,
  FileCheck2,
  CheckCircle2,
  Sparkles,
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

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Official accounts configuration with visual role styling
  const quickAccounts = [
    {
      name: 'عبدالرحمن الطوالة',
      roleTitle: 'مقدم الطلب (Employee)',
      empNum: '4412098',
      role: 'emp',
      roleBadge: 'مقدم الطلب',
      icon: User,
      border: 'border-emerald-200/90 hover:border-emerald-400',
      bg: 'bg-emerald-50/50 hover:bg-emerald-50/90',
      textBadge: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-700 bg-emerald-100/80',
    },
    {
      name: 'عمر الخنيني',
      roleTitle: 'المدير المباشر (Manager)',
      empNum: '4412001',
      role: 'manager',
      roleBadge: 'المدير المباشر',
      icon: Building2,
      border: 'border-indigo-200/90 hover:border-indigo-400',
      bg: 'bg-indigo-50/50 hover:bg-indigo-50/90',
      textBadge: 'bg-indigo-100 text-indigo-800',
      iconColor: 'text-indigo-700 bg-indigo-100/80',
    },
    {
      name: 'وائل العفيصان',
      roleTitle: 'مدقق الاعتماد (Auditor)',
      empNum: '4412002',
      role: 'auditor',
      roleBadge: 'مدقق الاعتماد',
      icon: FileCheck2,
      border: 'border-purple-200/90 hover:border-purple-400',
      bg: 'bg-purple-50/50 hover:bg-purple-50/90',
      textBadge: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-700 bg-purple-100/80',
    },
    {
      name: 'ناصر العصيمي',
      roleTitle: 'رافع ارتقاء (Uploader)',
      empNum: '4412003',
      role: 'uploader',
      roleBadge: 'رافع ارتقاء',
      icon: CheckCircle2,
      border: 'border-teal-200/90 hover:border-teal-400',
      bg: 'bg-teal-50/50 hover:bg-teal-50/90',
      textBadge: 'bg-teal-100 text-teal-800',
      iconColor: 'text-teal-700 bg-teal-100/80',
    },
    {
      name: 'وحدة العلاقات العامة والإعلام',
      roleTitle: 'العلاقات العامة (منصة X)',
      empNum: '4412004',
      role: 'pr',
      roleBadge: 'العلاقات العامة',
      icon: Megaphone,
      border: 'border-sky-200/90 hover:border-sky-400',
      bg: 'bg-sky-50/50 hover:bg-sky-50/90',
      textBadge: 'bg-sky-100 text-sky-800',
      iconColor: 'text-sky-700 bg-sky-100/80',
    },
    {
      name: 'بيان الطيار - الاعتمادات',
      roleTitle: 'موظف الاعتمادات (ارتقاء)',
      empNum: '4412005',
      role: 'accreditation',
      roleBadge: 'الاعتمادات',
      icon: Award,
      border: 'border-emerald-300/90 hover:border-emerald-500',
      bg: 'bg-emerald-50/60 hover:bg-emerald-100/80',
      textBadge: 'bg-emerald-200/80 text-emerald-900',
      iconColor: 'text-emerald-800 bg-emerald-200/80',
    },
    {
      name: 'سعادة رئيس الكلية التطبيقية',
      roleTitle: 'صفحة سعادة رئيس الكلية (الرئاسة والقيادة التنفيذية)',
      empNum: '4412000',
      role: 'dean',
      roleBadge: 'رئيس الكلية',
      icon: Crown,
      border: 'border-amber-300 hover:border-amber-500',
      bg: 'bg-amber-50/60 hover:bg-amber-100/80',
      textBadge: 'bg-amber-200/80 text-amber-900',
      iconColor: 'text-amber-800 bg-amber-200/80',
      fullWidth: true,
    },
  ];

  return (
    <div className="relative min-h-[90vh] py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-center font-['Tajawal',sans-serif] text-slate-900">
      {/* Subtle Institutional Geometric Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 -z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(197, 155, 39, 0.4) 1px, transparent 1px), radial-gradient(rgba(27, 67, 50, 0.45) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* Warm Ambient Radial Gradient Spots (Institutional Olive & Deep Forest) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(197,155,39,0.2)_0%,rgba(27,67,50,0.45)_45%,transparent_75%)] blur-3xl opacity-90" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-[radial-gradient(circle,rgba(20,55,40,0.6)_0%,transparent_70%)] blur-3xl opacity-80" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(8,28,21,0.9)_0%,transparent_70%)] blur-3xl opacity-90" />
      </div>

      {/* Brand Crest with Enhanced Golden-Green Halo Glow */}
      <div className="relative group mb-3.5">
        <div className="absolute -inset-3 bg-gradient-to-r from-[#c59b27]/50 via-emerald-400/40 to-[#c59b27]/50 rounded-3xl blur-2xl opacity-85 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1b4332] via-[#143728] to-[#081c15] rounded-3xl p-3 shadow-2xl border-2 border-[#c59b27]/60 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
          <img
            src="/icon.svg"
            alt="شعار الكلية التطبيقية"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Titles on Dark Luxury Background */}
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#e6c566] px-3.5 py-1 rounded-full bg-white/10 border border-[#c59b27]/40 shadow-inner backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#e6c566]" />
          <span>جامعة المجمعة • الكلية التطبيقية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
          منظومة اعتماد وتوثيق الأنشطة
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md mx-auto leading-relaxed">
          بوابة المواءمة المباشرة مع منصة ارتقاء والسجل المهاري الوطني للجامعة
        </p>
      </div>

      {/* Main Card Wrapper with Ambient Halo Glow (Glassmorphism Shadow) */}
      <div className="w-full max-w-xl relative group animate-in fade-in zoom-in-95 duration-300">
        {/* Soft Ambient Glow Halo behind the card */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#c59b27]/35 via-emerald-400/25 to-[#c59b27]/35 rounded-[2.5rem] blur-2xl opacity-90 transition-all duration-500 pointer-events-none -z-10" />
        <div className="absolute -inset-1 bg-gradient-to-b from-[#c59b27]/40 via-transparent to-[#1b4332]/40 rounded-3xl blur-md opacity-80 pointer-events-none -z-10" />

        {/* The Card Itself */}
        <div className="relative w-full bg-white/98 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_45px_rgba(197,155,39,0.2)] border border-[#c59b27]/40 text-right overflow-hidden">
          {/* Subtle Decorative Golden Corner Line */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#1b4332] via-[#c59b27] to-[#1b4332]" />

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6 text-xs font-bold border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setStaffError(null);
            }}
            className={`py-3 px-3 rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white text-[#1b4332] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#c59b27]" />
            <span>الموظفون والمسؤولون</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminError(null);
            }}
            className={`py-3 px-3 rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#1b4332] text-[#e6c566] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-[#e6c566]" />
            <span>مدير النظام (Admin)</span>
          </button>
        </div>

        {/* TAB 1: STAFF & OFFICERS LOGIN */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            {staffError && (
              <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-semibold leading-relaxed">{staffError}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>اسم المستخدم</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={staffEmpNum}
                  onChange={(e) => setStaffEmpNum(e.target.value)}
                  placeholder="أدخل اسم المستخدم..."
                  required
                  className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium bg-slate-50/80 focus:bg-white focus:border-[#1b4332] focus:ring-4 focus:ring-[#1b4332]/10 outline-none transition-all duration-200 shadow-2xs"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة المرور</span>
                <span className="text-[10px] text-slate-400 font-mono">الافتراضي: 123</span>
              </label>
              <div className="relative">
                <input
                  type={showStaffPassword ? 'text' : 'password'}
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full pr-11 pl-11 py-3 rounded-2xl border border-slate-200 text-sm font-medium bg-slate-50/80 focus:bg-white focus:border-[#1b4332] focus:ring-4 focus:ring-[#1b4332]/10 outline-none transition-all duration-200 shadow-2xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowStaffPassword(!showStaffPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
                  title={showStaffPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] hover:brightness-110 text-[#e6c566] hover:text-[#fef08a] font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1b4332]/25 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-[#c59b27]/40"
            >
              <span>تسجيل الدخول إلى النظام</span>
              <ArrowLeft className="w-4 h-4 text-[#e6c566] transition-transform group-hover:-translate-x-1" />
            </button>

            {/* QUICK FILL GRID - CLEAN & ELEGANT */}
            <div className="pt-4 border-t border-slate-100 text-right space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
                  <span className="text-xs font-black text-slate-700">
                    الحسابات الرسمية المعتمدة (تعبئة سريعة):
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  كلمة المرور: 123
                </span>
              </div>

              {/* Clean Grid System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {quickAccounts.map((acc) => {
                  const IconComponent = acc.icon;
                  const isSelected = staffEmpNum === acc.empNum;

                  return (
                    <button
                      key={acc.empNum}
                      type="button"
                      onClick={() => fillStaffCreds(acc.empNum, '123')}
                      className={`p-2.5 rounded-2xl border text-right font-medium active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-xs ${
                        acc.border
                      } ${acc.bg} ${acc.fullWidth ? 'sm:col-span-2' : ''} ${
                        isSelected ? 'ring-2 ring-[#1b4332] shadow-sm' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${acc.iconColor}`}
                          >
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <span className="font-extrabold text-slate-900 truncate">
                            {acc.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${acc.textBadge}`}>
                          {acc.roleBadge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 truncate pr-6.5">
                        {acc.roleTitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Cloud Status Indicator */}
              <div className="pt-3 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>النظام متصل بالسحابة اللحظية</span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SYSTEM ADMIN LOGIN */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-[#1b4332]/5 p-3.5 rounded-2xl border border-[#1b4332]/10 text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
                <span className="text-xs font-bold text-[#1b4332]">
                  بوابة إدارة وتكوين النظام المركزية (ناصر العصيمي)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                مخصصة لمدير النظام لإدارة المستخدمين، منح وتعديل الصلاحيات، وإدارة إعدادات النظام المركزية.
              </p>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-semibold leading-relaxed">{adminError}</span>
              </div>
            )}

            {/* Admin Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>اسم مستخدم مدير النظام</span>
                <span className="text-[10px] text-slate-400 font-mono">admin</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم (admin)..."
                  required
                  className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium bg-slate-50/80 focus:bg-white focus:border-[#1b4332] focus:ring-4 focus:ring-[#1b4332]/10 outline-none transition-all duration-200 shadow-2xs"
                />
                <KeyRound className="w-4 h-4 text-[#c59b27] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Admin Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة مرور المسؤول</span>
                <span className="text-[10px] text-slate-400 font-mono">admin</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full pr-11 pl-11 py-3 rounded-2xl border border-slate-200 text-sm font-medium bg-slate-50/80 focus:bg-white focus:border-[#1b4332] focus:ring-4 focus:ring-[#1b4332]/10 outline-none transition-all duration-200 shadow-2xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
                  title={showAdminPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] hover:brightness-110 text-[#e6c566] hover:text-[#fef08a] font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1b4332]/25 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-[#c59b27]/40"
            >
              <Shield className="w-4 h-4 text-[#e6c566]" />
              <span>دخول لوحة تحكم مدير النظام</span>
            </button>

            {/* Quick Fill Admin Card */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAdminUsername('admin');
                  setAdminPassword('admin');
                  setAdminError(null);
                }}
                className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-right flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">تعبئة بيانات مدير النظام السريعة</div>
                    <div className="text-[10px] text-slate-500">ناصر العصيمي (Admin Controller)</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  admin / admin
                </span>
              </button>

              {/* Live Cloud Status Indicator */}
              <div className="pt-2 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-2xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <span>النظام متصل بالسحابة اللحظية</span>
                </div>
              </div>
            </div>
          </form>
        )}
        </div>
      </div>

      {/* Footer System Meta */}
      <div className="mt-7 text-center text-[11px] text-emerald-200/75 space-y-1 select-none">
        <div>
          جميع الحقوق محفوظة © الكلية التطبيقية - جامعة المجمعة 1448هـ / 2026م
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-300/60">
          <span>بوابة السجل المهاري الوطني</span>
          <span>•</span>
          <span>منصة ارتقاء الجامعية</span>
          <span>•</span>
          <span className="text-[#e6c566] font-bold">السحابة اللحظية المباشرة</span>
        </div>
      </div>
    </div>
  );
};
