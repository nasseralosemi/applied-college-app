import React from 'react';
import {
  LogOut,
  Smartphone,
  ShieldCheck,
  Crown,
  Megaphone,
  Award,
  User,
  Building2,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, ActivityRequest } from '../types';
import { MajmaahLogo } from './MajmaahLogo';

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

  const renderRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-white" />;
      case 'dean':
        return <Crown className="w-4 h-4 text-[#C4B688]" />;
      case 'pr':
        return <Megaphone className="w-4 h-4 text-[#C4B688]" />;
      case 'accreditation':
        return <Award className="w-4 h-4 text-[#C4B688]" />;
      case 'auditor':
        return <FileCheck2 className="w-4 h-4 text-white" />;
      case 'manager':
        return <Building2 className="w-4 h-4 text-white" />;
      case 'uploader':
        return <CheckCircle2 className="w-4 h-4 text-white" />;
      default:
        return <User className="w-4 h-4 text-white" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 select-none drop-shadow-sm font-['Tajawal',sans-serif]">
      {/* 1. Main Header Body in Official Sage Green (#46523B) */}
      <div className="bg-gradient-to-b from-[#353F2D] via-[#46523B] to-[#46523B] text-white px-3 sm:px-6 pt-3 pb-2 transition-all">
        {/* Top Identity & Action Row */}
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Official University Crest & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <MajmaahLogo size="sm" showSubtitle={true} inverted={true} />
          </div>

          {/* Quick Actions & Live Cloud Sync */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Cloud Sync Indicator */}
            <div
              title="قاعدة بيانات سحابية حية (Firestore): مزامنة مستمرة"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold shadow-xs select-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">سحابة حية • متصل</span>
              <span className="sm:hidden">متصل</span>
            </div>

            {/* Mobile PWA Install */}
            {onOpenAndroidInstall && (
              <button
                type="button"
                onClick={onOpenAndroidInstall}
                title="تثبيت التطبيق على الجوال"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[#C4B688] flex items-center justify-center transition-all border border-white/15 cursor-pointer shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              title="تسجيل الخروج والعودة لشاشة الدخول"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-rose-500/30 active:scale-95 text-white transition-all border border-white/20 text-xs font-bold shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* User Identity Floating Pill */}
        <div className="max-w-7xl mx-auto mt-2.5 flex items-center justify-between bg-black/20 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-[#A08D52]/50 flex items-center justify-center text-white shrink-0 shadow-xs">
              {renderRoleIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-white truncate">
                <span>{profile.name}</span>
                {profile.employeeNumber && (
                  <span className="font-mono text-[9px] text-[#C4B688] bg-black/30 px-1.5 py-0.2 rounded border border-[#A08D52]/30">
                    #{profile.employeeNumber}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#C4B688] font-bold truncate">
                {profile.roleTitle}
              </div>
            </div>
          </div>

          <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
            صلاحيات معتمدة
          </span>
        </div>
      </div>

      {/* 2. Curved Wavy Separator with Refined Gold Accent */}
      <div className="relative w-full -mt-0.5 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-6 block text-[#FAF9F6]"
        >
          {/* Smooth organic curved wave filling with the content background color #FAF9F6 */}
          <path
            d="M0,0 C360,32 1080,32 1440,0 L1440,36 L0,36 Z"
            fill="currentColor"
          />
          {/* Subtle golden arc highlight line */}
          <path
            d="M0,0 C360,32 1080,32 1440,0"
            stroke="#A08D52"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </header>
  );
};

export default AppHeader;
