import React from 'react';
import { GraduationCap, LogOut, Smartphone, ShieldCheck } from 'lucide-react';
import { UserProfile, ActivityRequest } from '../types';

interface Props {
  profile: UserProfile;
  onLogout: () => void;
  requests: ActivityRequest[];
  onOpenAndroidInstall?: () => void;
}

export const AppHeader: React.FC<Props> = ({
  profile,
  onLogout,
  requests,
  onOpenAndroidInstall,
}) => {
  const role = profile.roleKey || 'emp';

  // Role-specific stats
  let stat1 = { val: requests.length, label: 'إجمالي الطلبات' };
  let stat2 = {
    val: requests.filter(
      (r) =>
        r.status === 'pending_manager' ||
        r.status === 'pending_auditor' ||
        r.status === 'returned_emp' ||
        r.status === 'returned_manager'
    ).length,
    label: 'قيد المعالجة',
  };
  let stat3 = {
    val: requests.filter(
      (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
    ).length,
    label: 'المكتملة',
  };

  if (role === 'emp') {
    const empRequests = profile.employeeNumber
      ? requests.filter((r) => r.submittedByEmpNumber === profile.employeeNumber || !r.submittedByEmpNumber)
      : requests;
    stat1 = { val: empRequests.length, label: 'طلباتي المرفوعة' };
    stat2 = {
      val: empRequests.filter(
        (r) => r.status === 'pending_manager' || r.status === 'pending_auditor'
      ).length,
      label: 'قيد الاعتماد',
    };
    stat3 = {
      val: empRequests.filter((r) => r.status === 'returned_emp').length,
      label: 'تحتاج تعديل',
    };
  } else if (role === 'manager') {
    const pendingManager = requests.filter(
      (r) => r.status === 'pending_manager' || r.status === 'returned_manager'
    ).length;
    const approved = requests.filter((r) => r.status !== 'pending_manager').length;
    stat1 = { val: pendingManager, label: 'بانتظار موافقتي' };
    stat2 = { val: approved, label: 'تمت إحالتها' };
    stat3 = {
      val: requests.filter((r) => r.status === 'returned_manager').length,
      label: 'مسترجعة للمراجعة',
    };
  } else if (role === 'auditor') {
    const pendingAuditor = requests.filter((r) => r.status === 'pending_auditor').length;
    const finalApproved = requests.filter(
      (r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
    ).length;
    stat1 = { val: pendingAuditor, label: 'بانتظار التدقيق' };
    stat2 = { val: finalApproved, label: 'معتمدة نهائياً' };
    stat3 = {
      val: requests.filter((r) => r.status === 'returned_manager').length,
      label: 'مسترجعة',
    };
  } else if (role === 'uploader') {
    const readyToUpload = requests.filter((r) => r.status === 'approved_final').length;
    const uploaded = requests.filter((r) => r.status === 'uploaded_irtqaa').length;
    stat1 = { val: readyToUpload, label: 'جاهز للرفع لارتقاء' };
    stat2 = { val: uploaded, label: 'رُفعت لارتقاء' };
    stat3 = { val: requests.length, label: 'إجمالي النظام' };
  } else if (role === 'admin') {
    stat1 = { val: requests.length, label: 'إجمالي الطلبات' };
    stat2 = {
      val: requests.filter(
        (r) => r.status === 'pending_manager' || r.status === 'pending_auditor'
      ).length,
      label: 'بانتظار الاعتماد',
    };
    stat3 = {
      val: requests.filter((r) => r.status === 'uploaded_irtqaa').length,
      label: 'رُفعت لارتقاء',
    };
  }

  return (
    <header className="bg-gradient-to-br from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 rounded-b-[28px] shadow-lg relative z-10 shrink-0 border-b border-[#c59b27]/30">
      {/* User Info Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#c59b27] rounded-xl flex items-center justify-center text-[#081c15] shadow-md shrink-0 border border-[#e6c566]/50">
            {role === 'admin' ? (
              <ShieldCheck className="w-5 h-5 text-[#081c15]" />
            ) : (
              <GraduationCap className="w-5 h-5 text-[#081c15]" />
            )}
          </div>
          <div>
            <div className="text-[10px] text-white/70 font-medium leading-none mb-1 flex items-center gap-1.5">
              <span>مرحباً،</span>
              {profile.employeeNumber && (
                <span className="font-mono text-white/60">#{profile.employeeNumber}</span>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide leading-tight">
              {profile.name}
            </h3>
            <span className="inline-block text-[10px] text-[#e6c566] font-semibold mt-0.5">
              {profile.roleTitle}
            </span>
          </div>
        </div>

        {/* Action Controls: Prominent Logout Button */}
        <div className="flex items-center gap-1.5">
          {onOpenAndroidInstall && (
            <button
              onClick={onOpenAndroidInstall}
              title="تثبيت التطبيق على الجوال"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-[#e6c566] flex items-center justify-center transition border border-white/15 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onLogout}
            title="تسجيل الخروج والعودة لشاشة الدخول"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white hover:text-rose-200 transition border border-white/20 text-xs font-bold shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Stats Banner Tailored to User's Role */}
      <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-md border border-white/15 flex justify-around items-center shadow-inner">
        <div className="text-center flex-1">
          <div className="text-sm font-black text-white leading-tight">
            {stat1.val}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            {stat1.label}
          </div>
        </div>
        <div className="w-px h-6 bg-white/20 self-center"></div>
        <div className="text-center flex-1">
          <div className="text-sm font-black text-[#e6c566] leading-tight">
            {stat2.val}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            {stat2.label}
          </div>
        </div>
        <div className="w-px h-6 bg-white/20 self-center"></div>
        <div className="text-center flex-1">
          <div className="text-sm font-black text-emerald-300 leading-tight">
            {stat3.val}
          </div>
          <div className="text-[10px] text-white/75 font-medium mt-0.5">
            {stat3.label}
          </div>
        </div>
      </div>
    </header>
  );
};

