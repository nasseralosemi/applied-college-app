import React from 'react';
import { UserRole, ActivityRequest } from '../types';
import { PlusCircle, ClipboardCheck, Stamp, CloudUpload } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  requests: ActivityRequest[];
}

export const BottomNav: React.FC<Props> = ({
  currentRole,
  onChangeRole,
  requests,
}) => {
  if (currentRole === 'login') return null;

  const managerCount = requests.filter(
    (r) => r.status === 'pending_manager' || r.status === 'returned_manager'
  ).length;

  const auditorCount = requests.filter(
    (r) => r.status === 'pending_auditor'
  ).length;

  const uploaderCount = requests.filter(
    (r) => r.status === 'approved_final'
  ).length;

  const navItems: {
    key: UserRole;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
  }[] = [
    { key: 'emp', label: 'الموظف', icon: PlusCircle },
    { key: 'manager', label: 'المدير', icon: ClipboardCheck, badgeCount: managerCount },
    { key: 'auditor', label: 'التدقيق', icon: Stamp, badgeCount: auditorCount },
    { key: 'uploader', label: 'ارتقاء', icon: CloudUpload, badgeCount: uploaderCount },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 pb-3 sm:pb-2.5 flex items-center justify-around shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] font-['Tajawal',sans-serif]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRole === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChangeRole(item.key)}
            className={`flex flex-col items-center justify-center flex-1 py-1 active:scale-95 transition-all duration-150 relative cursor-pointer group ${
              isActive ? 'text-[#1b4332]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
                    : 'text-slate-500 group-hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              {!!item.badgeCount && item.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c59b27] text-slate-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {item.badgeCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 whitespace-nowrap transition-all ${
                isActive ? 'font-extrabold text-[#1b4332]' : 'font-medium text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
