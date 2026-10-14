import React from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  RotateCcw,
  Bell,
  User,
  LogOut,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, UserRole, ActivityRequest } from '../types';
import { MajmaahLogo } from './MajmaahLogo';
import { NavTabKey } from './BottomNav';

interface Props {
  currentTab: NavTabKey;
  onSelectTab: (tab: NavTabKey) => void;
  currentRole: UserRole;
  profile: UserProfile;
  requests: ActivityRequest[];
  onLogout: () => void;
  onOpenAndroidInstall?: () => void;
  unreadNotificationCount?: number;
}

export const SidebarNav: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  currentRole,
  profile,
  requests,
  onLogout,
  onOpenAndroidInstall,
  unreadNotificationCount = 0,
}) => {
  if (currentRole === 'login') return null;

  const pendingCount =
    currentRole === 'manager'
      ? requests.filter((r) => r.status === 'pending_manager' || r.status === 'returned_manager').length
      : currentRole === 'auditor'
      ? requests.filter((r) => r.status === 'pending_auditor').length
      : currentRole === 'uploader'
      ? requests.filter((r) => r.status === 'approved_final' || r.attendanceSheet?.status === 'pending_review').length
      : currentRole === 'pr'
      ? requests.filter((r) => r.xPlatformPublish && r.prStatus !== 'published_pr').length
      : requests.filter((r) => r.status === 'returned_emp' || r.attendanceSheet?.status === 'returned').length;

  const approvedCount = requests.filter(
    (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  ).length;

  const returnedCount = requests.filter(
    (r) => r.status === 'returned_emp' || r.status === 'returned_manager'
  ).length;

  const activitiesLabel =
    currentRole === 'auditor'
      ? 'قائمة التدقيق الإداري'
      : currentRole === 'manager'
      ? 'معاملات الوحدة'
      : currentRole === 'emp'
      ? 'الأنشطة والطلبات'
      : 'لوحة الأنشطة والتدقيق';

  const navItems: {
    key: NavTabKey;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
  }[] = [
    {
      key: 'activities',
      label: activitiesLabel,
      icon: FileCheck2,
    },
    {
      key: 'pending',
      label: 'بانتظار التدقيق والموافقة',
      icon: Clock,
      badgeCount: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'approved',
      label: 'المعتمدة نهائياً',
      icon: CheckCircle2,
      badgeCount: approvedCount > 0 ? approvedCount : undefined,
    },
    {
      key: 'returned',
      label: 'المسترجعة للتعديل',
      icon: RotateCcw,
      badgeCount: returnedCount > 0 ? returnedCount : undefined,
    },
    {
      key: 'notifications',
      label: 'مركز التنبيهات والإشعارات',
      icon: Bell,
      badgeCount: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    { key: 'profile', label: 'الملف الشخصي والبيانات', icon: User },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col shrink-0 bg-white border-l border-[#46523B]/10 h-screen sticky top-0 z-30 select-none shadow-[4px_0_24px_rgba(70,82,59,0.03)] font-['Tajawal',sans-serif]">
      {/* 1. Header with Official University Logo */}
      <div className="p-4 sm:p-5 border-b border-[#46523B]/10 flex items-center justify-between">
        <MajmaahLogo size="sm" showSubtitle={true} />
      </div>

      {/* 2. User Profile Card (Strictly current user data only, no role changing) */}
      <div className="p-4 border-b border-slate-100 bg-[#FAF9F6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#46523B] text-[#A08D52] flex items-center justify-center font-bold shadow-xs shrink-0 border border-[#A08D52]/30">
            {(profile?.name || 'ع').split(' ')[0]?.[0] || 'ع'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-[#46523B] truncate leading-tight">
              {profile?.name || 'مستخدم المنظومة'}
            </h4>
            <span className="text-[11px] font-bold text-[#A08D52] truncate block">
              {profile?.roleTitle || 'عضو الكلية'}
            </span>
            {profile.employeeNumber && (
              <span className="text-[10px] font-mono text-slate-400">
                #{profile.employeeNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Navigation Links (Exclusively: Home, Activities/Audit, Notifications, Profile) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-black text-slate-400 px-3 py-1">
          التنقل المعتمد
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#46523B] text-white shadow-md shadow-[#46523B]/15 font-black'
                  : 'text-slate-700 hover:bg-[#FAF9F6] hover:text-[#46523B]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A08D52]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {!!item.badgeCount && item.badgeCount > 0 && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#A08D52] text-white' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Security badge notice */}
        <div className="pt-4 mt-3 border-t border-slate-100 px-2">
          <div className="p-2.5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#46523B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>نظام صلاحيات صارم (RBAC)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              تظهر الواجهات والبيانات بناءً على دور المستخدم المسجل فقط لضمان سرية وحوكمة الإجراءات.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Footer Controls (Sync status, Mobile install, Logout) */}
      <div className="p-3 border-t border-slate-100 bg-[#FAF9F6] space-y-2">
        {/* Sync Status */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-[#46523B]/10 text-[10px] text-slate-600 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>سحابة حية • متصل</span>
          </div>
          <span className="text-emerald-700 font-mono text-[9px]">Firestore</span>
        </div>

        {/* Mobile App Install button if applicable */}
        {onOpenAndroidInstall && (
          <button
            type="button"
            onClick={onOpenAndroidInstall}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#46523B] transition-all cursor-pointer shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#A08D52]" />
            <span>تثبيت تطبيق الجوال</span>
          </button>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold transition-all cursor-pointer border border-rose-200/80"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarNav;
