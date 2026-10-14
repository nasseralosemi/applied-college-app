import React from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  RotateCcw,
  Bell,
  User,
} from 'lucide-react';
import { ActivityRequest, UserRole } from '../types';

export type NavTabKey =
  | 'activities'
  | 'pending'
  | 'approved'
  | 'returned'
  | 'notifications'
  | 'profile'
  | 'home';

interface Props {
  currentTab: NavTabKey;
  onSelectTab: (tab: NavTabKey) => void;
  currentRole: UserRole;
  requests: ActivityRequest[];
  unreadNotificationCount?: number;
  currentUserEmpNumber?: string;
}

export const BottomNav: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  currentRole,
  requests,
  unreadNotificationCount = 0,
  currentUserEmpNumber,
}) => {
  if (currentRole === 'login') return null;

  // Normalized tab (graceful fallback for 'home')
  const effectiveTab: NavTabKey = currentTab === 'home' ? 'pending' : currentTab;

  // 1. Pending queue count calculation by user role
  const pendingCount =
    currentRole === 'manager'
      ? requests.filter((r) => r.status === 'pending_manager' || r.status === 'returned_manager').length
      : currentRole === 'auditor'
      ? requests.filter((r) => r.status === 'pending_auditor').length
      : currentRole === 'uploader'
      ? requests.filter((r) => r.status === 'approved_final' || r.attendanceSheet?.status === 'pending_review').length
      : currentRole === 'pr'
      ? requests.filter((r) => r.xPlatformPublish && r.prStatus !== 'published_pr').length
      : currentRole === 'dean'
      ? requests.filter((r) => !r.deanApproved && (r.status === 'pending_auditor' || r.status === 'approved_final')).length
      : currentRole === 'accreditation'
      ? requests.filter((r) => r.status === 'approved_final' && !r.accreditationDocument).length
      : currentRole === 'emp'
      ? requests.filter(
          (r) =>
            (!currentUserEmpNumber || r.submittedByEmpNumber === currentUserEmpNumber || !r.submittedByEmpNumber) &&
            (r.status === 'pending_manager' || r.status === 'pending_auditor')
        ).length
      : requests.filter((r) => r.status === 'pending_auditor' || r.status === 'pending_manager').length;

  // 2. Approved queue count calculation by user role
  const approvedCount =
    currentRole === 'auditor'
      ? requests.filter((r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length
      : currentRole === 'manager'
      ? requests.filter((r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa' || r.status === 'pending_auditor').length
      : currentRole === 'pr'
      ? requests.filter((r) => r.prStatus === 'published_pr').length
      : currentRole === 'uploader'
      ? requests.filter((r) => r.status === 'uploaded_irtqaa').length
      : currentRole === 'dean'
      ? requests.filter((r) => r.deanApproved || r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length
      : currentRole === 'accreditation'
      ? requests.filter((r) => r.status === 'uploaded_irtqaa').length
      : currentRole === 'emp'
      ? requests.filter(
          (r) =>
            (!currentUserEmpNumber || r.submittedByEmpNumber === currentUserEmpNumber || !r.submittedByEmpNumber) &&
            (r.status === 'approved_final' || r.status === 'uploaded_irtqaa')
        ).length
      : requests.filter((r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length;

  // 3. Returned count calculation by user role
  const returnedCount =
    currentRole === 'manager'
      ? requests.filter((r) => r.status === 'returned_emp' || r.status === 'rejected').length
      : currentRole === 'auditor'
      ? requests.filter((r) => r.status === 'returned_manager' || r.status === 'returned_emp').length
      : currentRole === 'uploader'
      ? requests.filter((r) => r.attendanceSheet?.status === 'returned').length
      : currentRole === 'emp'
      ? requests.filter(
          (r) =>
            (!currentUserEmpNumber || r.submittedByEmpNumber === currentUserEmpNumber || !r.submittedByEmpNumber) &&
            (r.status === 'returned_emp' || r.status === 'returned_manager' || r.attendanceSheet?.status === 'returned')
        ).length
      : requests.filter((r) => r.status === 'returned_emp' || r.status === 'returned_manager').length;

  // 4. Role-specific labels
  const activitiesLabel =
    currentRole === 'auditor'
      ? 'التدقيق'
      : currentRole === 'manager'
      ? 'المعاملات'
      : currentRole === 'emp'
      ? 'الطلبات'
      : currentRole === 'pr'
      ? 'التغطيات'
      : currentRole === 'dean'
      ? 'الاعتماد'
      : 'التدقيق';

  const pendingLabel =
    currentRole === 'manager'
      ? 'بانتظار موافقتي'
      : currentRole === 'emp'
      ? 'قيد التدقيق'
      : currentRole === 'pr'
      ? 'قيد النشر'
      : 'بانتظار التدقيق';

  const navItems: {
    key: NavTabKey;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeVariant?: 'amber' | 'emerald' | 'rose' | 'gold';
  }[] = [
    {
      key: 'activities',
      label: activitiesLabel,
      icon: FileCheck2,
      badgeCount: undefined,
    },
    {
      key: 'pending',
      label: pendingLabel,
      icon: Clock,
      badgeCount: pendingCount > 0 ? pendingCount : undefined,
      badgeVariant: 'amber',
    },
    {
      key: 'approved',
      label: 'المعتمدة',
      icon: CheckCircle2,
      badgeCount: approvedCount > 0 ? approvedCount : undefined,
      badgeVariant: 'emerald',
    },
    {
      key: 'returned',
      label: 'المسترجعة',
      icon: RotateCcw,
      badgeCount: returnedCount > 0 ? returnedCount : undefined,
      badgeVariant: 'rose',
    },
    {
      key: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      badgeCount: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeVariant: 'gold',
    },
    {
      key: 'profile',
      label: 'الملف',
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-2.5 left-2 right-2 z-40 max-w-lg mx-auto pointer-events-auto">
      {/* Emerald Green Container (#46523B) with Golden Highlights */}
      <nav
        dir="rtl"
        className="bg-gradient-to-r from-[#323B2A] via-[#46523B] to-[#323B2A] backdrop-blur-xl rounded-[28px] p-1 sm:p-1.5 shadow-[0_14px_40px_rgba(40,48,32,0.45),0_4px_16px_rgba(0,0,0,0.25)] border border-[#A08D52]/35 font-['Tajawal',sans-serif] select-none text-white"
      >
        <div className="grid grid-cols-6 gap-0.5 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = effectiveTab === item.key;

            const badgeBg =
              item.badgeVariant === 'rose'
                ? 'bg-rose-500'
                : item.badgeVariant === 'emerald'
                ? 'bg-emerald-500'
                : item.badgeVariant === 'gold'
                ? 'bg-[#A08D52]'
                : 'bg-amber-500';

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectTab(item.key)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 relative cursor-pointer min-h-[50px] ${
                  isActive
                    ? 'bg-gradient-to-b from-[#B8A468] to-[#927F47] text-white shadow-md shadow-[#927F47]/40 ring-1 ring-[#C4B688]/60 font-black scale-[1.02]'
                    : 'text-white/75 hover:text-white hover:bg-white/10 active:scale-95'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icon
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                        isActive ? 'scale-110 text-white' : 'text-white/80'
                      }`}
                    />
                  </div>

                  {!!item.badgeCount && item.badgeCount > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 ${badgeBg} text-white text-[8px] font-black px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center border border-[#46523B] shadow-xs leading-none`}
                    >
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[8.5px] sm:text-[9.5px] mt-0.5 leading-tight truncate w-full text-center px-0.5 ${
                    isActive ? 'font-black text-white' : 'font-medium text-white/75'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
