import React from 'react';
import {
  GraduationCap,
  LogOut,
  Smartphone,
  ShieldCheck,
  Crown,
  Megaphone,
  Award,
} from 'lucide-react';
import { UserProfile, ActivityRequest } from '../types';

interface Props {
  profile: UserProfile;
  onLogout: () => void;
  requests?: ActivityRequest[];
  onOpenAndroidInstall?: () => void;
}

export const AppHeader: React.FC<Props> = ({
  profile,
  onLogout,
  onOpenAndroidInstall,
}) => {
  const role = profile.roleKey || 'emp';

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-b-2xl shadow-lg shadow-slate-900/10 backdrop-blur-md shrink-0 border-b border-[#c59b27]/30 transition-all duration-200">
      {/* User Info & Action Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* User Identity & Avatar */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#dfb13c] via-[#c59b27] to-[#997415] rounded-2xl flex items-center justify-center text-[#081c15] shadow-md shrink-0 border border-[#e6c566]/60 transition-transform hover:scale-105">
            {role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#081c15]" />
            ) : role === 'dean' ? (
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#081c15]" />
            ) : role === 'pr' ? (
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#081c15]" />
            ) : role === 'accreditation' ? (
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#081c15]" />
            ) : (
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#081c15]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-200/90 font-medium leading-none mb-0.5 flex items-center gap-1.5 truncate">
              <span>مرحباً،</span>
              {profile.employeeNumber && (
                <span className="font-mono bg-white/10 px-1.5 py-0.2 rounded text-white/80 text-[9px]">
                  #{profile.employeeNumber}
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide leading-tight truncate">
              {profile.name}
            </h3>
            <span className="inline-block text-[10px] text-[#e6c566] font-semibold truncate">
              {profile.roleTitle}
            </span>
          </div>
        </div>

        {/* Action Controls: Live Cloud Status & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cloud Database Live Sync Indicator */}
          <div
            title="قاعدة بيانات سحابية حية (Firestore): مزامنة لحظية مستمرة عبر كافة الأجهزة"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold shadow-xs select-none"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">سحابة حية • متصل</span>
            <span className="sm:hidden">متصل</span>
          </div>

          {onOpenAndroidInstall && (
            <button
              type="button"
              onClick={onOpenAndroidInstall}
              title="تثبيت التطبيق على الجوال"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[#e6c566] flex items-center justify-center transition-all border border-white/15 cursor-pointer shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            title="تسجيل الخروج والعودة لشاشة الدخول"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/25 active:scale-95 text-white hover:text-rose-100 transition-all border border-white/20 text-xs font-bold shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};
