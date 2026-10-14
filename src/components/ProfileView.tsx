import React from 'react';
import { SystemUser, UserProfile, UserRole } from '../types';
import { MajmaahLogo } from './MajmaahLogo';
import {
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  Smartphone,
  LogOut,
  CheckCircle2,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: SystemUser | null;
  profile: UserProfile | null;
  currentRole: UserRole;
  onLogout: () => void;
  onOpenAndroidInstall?: () => void;
}

export const ProfileView: React.FC<Props> = ({
  currentUser,
  profile,
  currentRole,
  onLogout,
  onOpenAndroidInstall,
}) => {
  return (
    <div className="space-y-4 pb-12 font-['Tajawal',sans-serif] text-right">
      {/* Top Banner with University Identity */}
      <div className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_-2px_rgba(70,82,59,0.06)] border border-[#46523B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-b from-[#46523B] via-[#A08D52] to-[#46523B]" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[32px] bg-[#46523B] text-[#A08D52] flex items-center justify-center text-2xl font-black shrink-0 border-2 border-[#A08D52]/40 shadow-sm">
            {(profile?.name || currentUser?.name || 'ع').split(' ')[0]?.[0] || 'ع'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-[#46523B]">
                {profile?.name || currentUser?.name || 'مستخدم المنظومة'}
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A08D52]/15 text-[#A08D52] border border-[#A08D52]/30">
                {profile?.roleTitle || 'عضو الكلية'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>الرقم الوظيفي:</span>
              <span className="font-mono font-bold bg-[#FAF9F6] px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                #{profile?.employeeNumber || currentUser?.employeeNumber}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>حساب نشط ومفعّل</span>
          </div>
        </div>
      </div>

      {/* Official Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Official Career Details */}
        <div className="bg-white rounded-[32px] p-5 border border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] space-y-4">
          <h3 className="text-xs font-black text-[#46523B] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#A08D52]" />
            <span>البيانات الوظيفية والمؤسسية المعتمدة</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">الجهة الأكاديمية:</span>
              <span className="font-black text-slate-800">جامعة المجمعة • الكلية التطبيقية</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">القسم / الوحدة:</span>
              <span className="font-bold text-slate-800">
                {currentUser?.department || profile?.department || 'الكادر الأكاديمي والإداري'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">مقر الفرع:</span>
              <span className="font-bold text-slate-800">
                {currentUser?.branch || 'المقر الرئيسي'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">المسمى بالمنظومة:</span>
              <span className="font-black text-[#A08D52]">
                {profile?.roleTitle}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 font-medium">الربط الوطني:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                مواءمة منصة ارتقاء الرسمية
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Security & RBAC Privileges */}
        <div className="bg-white rounded-[32px] p-5 border border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] space-y-4">
          <h3 className="text-xs font-black text-[#46523B] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Lock className="w-4 h-4 text-[#A08D52]" />
            <span>الصلاحيات والأمان (RBAC Security)</span>
          </h3>

          <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#46523B]" />
              <span>صلاحيات مقيدة وآمنة حسب الدور المعتمد</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              هذا الحساب يخضع لنظام حوكمة الصلاحيات الصارم. تقتصر شاشاتك وإجراءاتك حصرياً على المهام الموكلة لدورك الرسمي ({profile?.roleTitle})، ولا يمكن الوصول لأدوار أخرى دون تفويض مسبق من مدير النظام.
            </p>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">حالة التحقق:</span>
              <span className="font-bold text-[#46523B]">موثق ومعتمد رسمياً</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">تشفير الجلسة:</span>
              <span className="font-mono font-bold text-slate-700">AES-256 Cloud Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Mobile PWA App & Quick Actions */}
      <div className="bg-white rounded-[32px] p-5 border border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#A08D52]/10 text-[#A08D52] flex items-center justify-center shrink-0 border border-[#A08D52]/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900">
              تطبيق الجوال التفاعلي (Native Feel)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              يمكنك إضافة المنصة إلى شاشة الجوال الرئيسية للوصول الفوري وتلقي التحديثات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAndroidInstall && (
            <button
              type="button"
              onClick={onOpenAndroidInstall}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#46523B] hover:bg-[#384230] text-white font-black text-xs transition cursor-pointer shadow-xs active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>تثبيت التطبيق</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
