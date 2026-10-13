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

  // Official accounts configuration with visual role styling in dark luxury mode
  const quickAccounts = [
    {
      name: 'عبدالرحمن الطوالة',
      roleTitle: 'مقدم الطلب (Employee)',
      empNum: '4412098',
      role: 'emp',
      roleBadge: 'مقدم الطلب',
      icon: User,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'عمر الخنيني',
      roleTitle: 'المدير المباشر (Manager)',
      empNum: '4412001',
      role: 'manager',
      roleBadge: 'المدير المباشر',
      icon: Building2,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'وائل العفيصان',
      roleTitle: 'مدقق الاعتماد (Auditor)',
      empNum: '4412002',
      role: 'auditor',
      roleBadge: 'مدقق الاعتماد',
      icon: FileCheck2,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'ناصر العصيمي',
      roleTitle: 'رافع ارتقاء (Uploader)',
      empNum: '4412003',
      role: 'uploader',
      roleBadge: 'رافع ارتقاء',
      icon: CheckCircle2,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'وحدة العلاقات العامة والإعلام',
      roleTitle: 'العلاقات العامة (منصة X)',
      empNum: '4412004',
      role: 'pr',
      roleBadge: 'العلاقات العامة',
      icon: Megaphone,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'بيان الطيار - الاعتمادات',
      roleTitle: 'موظف الاعتمادات (ارتقاء)',
      empNum: '4412005',
      role: 'accreditation',
      roleBadge: 'الاعتمادات',
      icon: Award,
      border: 'border-emerald-500/35 hover:border-emerald-400',
      bg: 'bg-[#081f15]/85 hover:bg-[#0f2e20]',
      textBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400 bg-emerald-950/80',
    },
    {
      name: 'سعادة رئيس الكلية التطبيقية',
      roleTitle: 'صفحة سعادة رئيس الكلية (الرئاسة والقيادة التنفيذية)',
      empNum: '4412000',
      role: 'dean',
      roleBadge: 'رئيس الكلية',
      icon: Crown,
      border: 'border-[#c59b27]/60 hover:border-[#e6c566]',
      bg: 'bg-gradient-to-r from-amber-950/40 via-emerald-950/60 to-amber-950/40 hover:from-amber-950/60 hover:to-amber-950/60',
      textBadge: 'bg-[#c59b27]/30 text-[#e6c566] border border-[#c59b27]/50',
      iconColor: 'text-[#e6c566] bg-[#c59b27]/25',
      fullWidth: true,
    },
  ];

  return (
    <div className="relative min-h-screen py-8 sm:py-14 px-3 sm:px-6 flex flex-col items-center justify-center font-['Tajawal',sans-serif] text-white selection:bg-emerald-500 selection:text-white bg-gradient-to-br from-[#04100a] via-[#092218] to-[#030d07]">
      {/* Subtle Institutional Geometric Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(197, 155, 39, 0.45) 1px, transparent 1px), radial-gradient(rgba(16, 185, 129, 0.35) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Warm Ambient Radial Gradient Spots (Institutional Olive, Deep Forest & Golden Glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.22)_0%,rgba(27,67,50,0.5)_45%,transparent_75%)] blur-3xl opacity-90" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(197,155,39,0.25)_0%,transparent_70%)] blur-3xl opacity-80" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.25)_0%,transparent_70%)] blur-3xl opacity-90" />
      </div>

      {/* Brand Crest with Enhanced Golden-Green Halo Glow */}
      <div className="relative group mb-4">
        <div className="absolute -inset-3 bg-gradient-to-r from-[#c59b27]/60 via-emerald-400/50 to-[#c59b27]/60 rounded-3xl blur-2xl opacity-85 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1b4332] via-[#103022] to-[#04120c] rounded-3xl p-3 shadow-2xl border-2 border-[#c59b27]/70 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
          <img
            src="/icon.svg"
            alt="شعار الكلية التطبيقية"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Titles on Dark Luxury Background */}
      <div className="text-center mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#e6c566] px-3.5 py-1 rounded-full bg-emerald-950/80 border border-[#c59b27]/40 shadow-inner backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#e6c566]" />
          <span>جامعة المجمعة • الكلية التطبيقية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-lg">
          منظومة اعتماد وتوثيق الأنشطة
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-md mx-auto leading-relaxed">
          بوابة المواءمة المباشرة مع منصة ارتقاء والسجل المهاري الوطني للجامعة
        </p>
      </div>

      {/* Main Card Wrapper with Ambient Halo Glow (Glassmorphism Shadow) */}
      <div className="w-full max-w-xl relative group animate-in fade-in zoom-in-95 duration-300">
        {/* Soft Ambient Glow Halo behind the card */}
        <div className="absolute -inset-3 bg-gradient-to-r from-emerald-600/30 via-emerald-400/25 to-[#c59b27]/30 rounded-[2.5rem] blur-2xl opacity-85 transition-all duration-500 pointer-events-none -z-10 animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/40 via-transparent to-[#c59b27]/30 rounded-3xl blur-md opacity-60 pointer-events-none -z-10" />

        {/* The Luxury Dark Glass Card */}
        <div className="relative w-full bg-gradient-to-b from-[#0b2419]/92 via-[#071a12]/95 to-[#04120c]/98 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.18)] border border-emerald-500/35 text-right overflow-hidden">
          {/* Subtle Decorative Golden/Green Top Line */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#c59b27] via-emerald-400 to-[#c59b27]" />

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-black/45 rounded-2xl mb-6 text-xs font-bold border border-emerald-500/25 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab('staff');
                setStaffError(null);
              }}
              className={`py-3 px-3 rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-emerald-700 via-[#1b4332] to-emerald-800 text-white shadow-lg border border-emerald-400/40 font-black'
                  : 'text-emerald-200/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#e6c566]" />
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
                  ? 'bg-gradient-to-r from-[#c59b27] to-[#e6c566] text-slate-950 shadow-lg border border-[#c59b27]/50 font-black'
                  : 'text-emerald-200/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>مدير النظام (Admin)</span>
            </button>
          </div>

          {/* TAB 1: STAFF & OFFICERS LOGIN */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              {staffError && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 shadow-md">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="font-semibold leading-relaxed">{staffError}</span>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>اسم المستخدم</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={staffEmpNum}
                    onChange={(e) => setStaffEmpNum(e.target.value)}
                    placeholder="أدخل اسم المستخدم..."
                    required
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-emerald-500/35 text-sm font-semibold text-white placeholder-emerald-200/30 bg-black/45 focus:bg-black/65 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 shadow-inner"
                  />
                  <User className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>كلمة المرور</span>
                  <span className="text-[10px] text-[#e6c566] font-mono bg-[#c59b27]/20 px-2 py-0.5 rounded border border-[#c59b27]/40">الافتراضي: 123</span>
                </label>
                <div className="relative">
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full pr-11 pl-11 py-3 rounded-2xl border border-emerald-500/35 text-sm font-semibold text-white placeholder-emerald-200/30 bg-black/45 focus:bg-black/65 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 shadow-inner"
                  />
                  <Lock className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white p-1 rounded-lg transition cursor-pointer"
                    title={showStaffPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-emerald-600 via-[#1b4332] to-[#0f2d21] hover:from-emerald-500 hover:to-[#1b4332] text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-emerald-400/50"
              >
                <span className="text-[#e6c566] group-hover:text-white transition-colors">تسجيل الدخول إلى النظام</span>
                <ArrowLeft className="w-4 h-4 text-[#e6c566] transition-transform group-hover:-translate-x-1" />
              </button>

              {/* QUICK FILL GRID - CLEAN & ELEGANT */}
              <div className="pt-4 border-t border-emerald-500/20 text-right space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c59b27] animate-pulse"></span>
                    <span className="text-xs font-black text-white">
                      الحسابات الرسمية المعتمدة (تعبئة سريعة):
                    </span>
                  </div>
                  <span className="text-[11px] text-[#e6c566] font-mono bg-black/40 px-2 py-0.5 rounded-lg border border-[#c59b27]/30">
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
                        className={`p-2.5 rounded-2xl border text-right font-medium active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-md ${
                          acc.border
                        } ${acc.bg} ${acc.fullWidth ? 'sm:col-span-2' : ''} ${
                          isSelected ? 'ring-2 ring-emerald-400 border-emerald-400 bg-[#123625] shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${acc.iconColor}`}
                            >
                              <IconComponent className="w-3 h-3" />
                            </div>
                            <span className="font-extrabold text-white truncate">
                              {acc.name}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${acc.textBadge}`}>
                            {acc.roleBadge}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-200/80 truncate pr-6.5 font-medium">
                          {acc.roleTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Live Cloud Status Indicator */}
                <div className="pt-3 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 text-xs font-bold shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>النظام متصل بالسحابة اللحظية المباشرة</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SYSTEM ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-500/30 text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
                  <span className="text-xs font-bold text-[#e6c566]">
                    بوابة إدارة وتكوين النظام المركزية (ناصر العصيمي)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  مخصصة لمدير النظام لإدارة المستخدمين، منح وتعديل الصلاحيات، وإدارة إعدادات النظام المركزية.
                </p>
              </div>

              {adminError && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 shadow-md">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="font-semibold leading-relaxed">{adminError}</span>
                </div>
              )}

              {/* Admin Username Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>اسم مستخدم مدير النظام</span>
                  <span className="text-[10px] text-[#e6c566] font-mono bg-[#c59b27]/20 px-2 py-0.5 rounded border border-[#c59b27]/40">admin</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم (admin)..."
                    required
                    className="w-full pr-11 pl-4 py-3 rounded-2xl border border-emerald-500/35 text-sm font-semibold text-white placeholder-emerald-200/30 bg-black/45 focus:bg-black/65 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 shadow-inner"
                  />
                  <KeyRound className="w-4 h-4 text-[#c59b27] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Admin Password Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>كلمة مرور المسؤول</span>
                  <span className="text-[10px] text-[#e6c566] font-mono bg-[#c59b27]/20 px-2 py-0.5 rounded border border-[#c59b27]/40">admin</span>
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full pr-11 pl-11 py-3 rounded-2xl border border-emerald-500/35 text-sm font-semibold text-white placeholder-emerald-200/30 bg-black/45 focus:bg-black/65 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 shadow-inner"
                  />
                  <Lock className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white p-1 rounded-lg transition cursor-pointer"
                    title={showAdminPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-emerald-600 via-[#1b4332] to-[#0f2d21] hover:from-emerald-500 hover:to-[#1b4332] text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-emerald-400/50"
              >
                <Shield className="w-4 h-4 text-[#e6c566]" />
                <span className="text-[#e6c566] group-hover:text-white transition-colors">دخول لوحة تحكم مدير النظام</span>
              </button>

              {/* Quick Fill Admin Card */}
              <div className="pt-3 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('admin');
                    setAdminPassword('admin');
                    setAdminError(null);
                  }}
                  className="w-full p-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 hover:bg-emerald-900/60 text-right flex items-center justify-between text-xs transition cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#c59b27]/20 text-[#e6c566] border border-[#c59b27]/40 flex items-center justify-center font-bold">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white">تعبئة بيانات مدير النظام السريعة</div>
                      <div className="text-[10px] text-emerald-200/80">ناصر العصيمي (Admin Controller)</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#e6c566] bg-black/40 px-2 py-0.5 rounded border border-[#c59b27]/40">
                    admin / admin
                  </span>
                </button>
              </div>

              {/* Live Cloud Status Indicator */}
              <div className="pt-2 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 text-xs font-bold shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>النظام متصل بالسحابة اللحظية المباشرة</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer System Meta */}
      <div className="mt-8 text-center text-[11px] text-emerald-200/80 space-y-1 select-none">
        <div>
          جميع الحقوق محفوظة © الكلية التطبيقية - جامعة المجمعة 1448هـ / 2026م
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400/70">
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
