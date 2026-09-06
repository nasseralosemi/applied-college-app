import React from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import { UserProfile, ActivityRequest } from '../types';

interface Props {
  profile: UserProfile;
  onLogout: () => void;
  requests: ActivityRequest[];
}

export const AppHeader: React.FC<Props> = ({ profile, onLogout, requests }) => {
  const totalCount = requests.length;
  const inProgressCount = requests.filter(
    (r) => r.status === 'pending_manager' || r.status === 'pending_auditor' || r.status === 'returned_emp' || r.status === 'returned_manager'
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  ).length;

  return (
    <header className="bg-gradient-to-br from-[#1b4332] via-[#143728] to-[#081c15] text-white p-5 pb-5 rounded-b-[32px] shadow-xl relative z-10 shrink-0 border-b border-[#c59b27]/30">
      {/* User Info Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#c59b27] rounded-2xl flex items-center justify-center text-[#081c15] shadow-lg shadow-[#1b4332]/30 shrink-0 border border-[#e6c566]/50">
            <GraduationCap className="w-6 h-6 text-[#081c15]" />
          </div>
          <div>
            <div className="text-[11px] text-white/70 font-medium leading-none mb-1">
              أهلاً بك،
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-wide">
              {profile.name}
            </h3>
            <span className="inline-block text-[10px] text-[#e6c566] font-semibold">
              {profile.roleTitle}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="تسجيل الخروج"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/15 shadow-inner cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Sleek Frosted Stats Banner */}
      <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/15 flex justify-around items-center shadow-inner">
        <div className="text-center flex-1">
          <div className="text-base font-extrabold text-white leading-tight">
            {totalCount}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            إجمالي الطلبات
          </div>
        </div>
        <div className="w-px h-7 bg-white/20 self-center"></div>
        <div className="text-center flex-1">
          <div className="text-base font-extrabold text-[#e6c566] leading-tight">
            {inProgressCount}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            قيد المعالجة
          </div>
        </div>
        <div className="w-px h-7 bg-white/20 self-center"></div>
        <div className="text-center flex-1">
          <div className="text-base font-extrabold text-emerald-300 leading-tight">
            {completedCount}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            مكتملة
          </div>
        </div>
      </div>
    </header>
  );
};

