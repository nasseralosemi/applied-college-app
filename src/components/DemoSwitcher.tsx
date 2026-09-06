import React from 'react';
import { UserRole } from '../types';
import { Sliders, Smartphone, Monitor, RotateCcw, Rocket, Download } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
  onResetData: () => void;
  totalRequests: number;
  onOpenStoreReadiness: () => void;
  onOpenAndroidInstall: () => void;
}

export const DemoSwitcher: React.FC<Props> = ({
  currentRole,
  onSelectRole,
  isPhoneFrame,
  onToggleFrame,
  onResetData,
  totalRequests,
  onOpenStoreReadiness,
  onOpenAndroidInstall,
}) => {
  const roles: { key: UserRole; label: string; number: string }[] = [
    { key: 'emp', label: 'الموظف', number: '1.' },
    { key: 'manager', label: 'المدير المباشر', number: '2.' },
    { key: 'auditor', label: 'موظف التدقيق', number: '3.' },
    { key: 'uploader', label: 'الرفع لارتقاء', number: '4.' },
  ];

  return (
    <header className="w-full max-w-6xl mb-3 flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl shadow-sm text-gray-800">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
        <span className="text-xs font-extrabold text-[#1b4332] whitespace-nowrap flex items-center gap-1.5 shrink-0 ml-1">
          <Sliders className="w-4 h-4 text-[#c59b27]" />
          <span>محاكاة الأدوار:</span>
        </span>
        {roles.map((r) => {
          const isActive = currentRole === r.key;
          return (
            <button
              key={r.key}
              onClick={() => onSelectRole(r.key)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-bold transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1b4332] text-[#e6c566] shadow-sm shadow-[#1b4332]/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r.number} {r.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAndroidInstall}
          title="تثبيت مباشر وفوري على هاتف أندرويد (WebAPK / QR Code)"
          className="text-xs bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm animate-pulse"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت على أندرويد</span>
        </button>

        <button
          type="button"
          onClick={onOpenStoreReadiness}
          title="مركز تجهيز النشر على متاجر التطبيقات (Google Play & App Store)"
          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] border border-emerald-200 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Rocket className="w-3.5 h-3.5 text-[#c59b27]" />
          <span>تجهيز المتاجر</span>
        </button>

        <button
          onClick={onToggleFrame}
          title={isPhoneFrame ? 'التبديل إلى العرض الموسع' : 'التبديل إلى مظهر هاتف جوال'}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>موسع</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>إطار هاتف</span>
            </>
          )}
        </button>

        <button
          onClick={onResetData}
          title="استعادة البيانات الأصلية"
          className="text-xs bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700 font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة ({totalRequests})</span>
        </button>
      </div>
    </header>
  );
};

