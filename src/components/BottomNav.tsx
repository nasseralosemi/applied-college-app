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
    <nav className="bg-white border-t border-gray-100 px-3 py-2 flex items-center justify-around shrink-0 relative z-10 shadow-md">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRole === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChangeRole(item.key)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition relative cursor-pointer group ${
              isActive ? 'text-[#1b4332]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                  isActive ? 'bg-[#1b4332]/10 text-[#1b4332]' : 'text-gray-400 group-hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              {!!item.badgeCount && item.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c59b27] text-[#081c15] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {item.badgeCount}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] mt-0.5 whitespace-nowrap transition ${
                isActive ? 'font-extrabold text-[#1b4332]' : 'font-medium'
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
