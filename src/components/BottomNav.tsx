import React from 'react';
import {
  Home,
  FileCheck2,
  Bell,
  User,
} from 'lucide-react';
import { ActivityRequest, UserRole } from '../types';

export type NavTabKey = 'home' | 'activities' | 'notifications' | 'profile';

interface Props {
  currentTab: NavTabKey;
  onSelectTab: (tab: NavTabKey) => void;
  currentRole: UserRole;
  requests: ActivityRequest[];
  unreadNotificationCount?: number;
}

export const BottomNav: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  currentRole,
  requests,
  unreadNotificationCount = 0,
}) => {
  if (currentRole === 'login') return null;

  // Pending queue count for current user
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

  const navItems: {
    key: NavTabKey;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
  }[] = [
    { key: 'home', label: 'الرئيسية', icon: Home },
    {
      key: 'activities',
      label: currentRole === 'auditor' ? 'التدقيق' : 'الأنشطة/الطلبات',
      icon: FileCheck2,
      badgeCount: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      badgeCount: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    { key: 'profile', label: 'الملف الشخصي', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto pointer-events-auto">
      <nav className="bg-white/95 backdrop-blur-xl rounded-[32px] px-2 py-1.5 flex items-center justify-around shadow-[0_12px_36px_-6px_rgba(70,82,59,0.18),0_4px_12px_rgba(0,0,0,0.06)] border border-[#46523B]/15 font-['Tajawal',sans-serif] select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 active:scale-95 transition-all duration-200 relative cursor-pointer min-h-[46px] rounded-2xl ${
                isActive ? 'text-[#46523B]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#46523B] text-[#A08D52] shadow-md shadow-[#46523B]/25 scale-105'
                      : 'text-slate-500 hover:bg-[#FAF9F6]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                {!!item.badgeCount && item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#A08D52] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 whitespace-nowrap transition-all ${
                  isActive ? 'font-black text-[#46523B]' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
