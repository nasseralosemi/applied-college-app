import React from 'react';
import { ActivityRequest } from '../types';
import { Check, Clock, Ban, ExternalLink } from 'lucide-react';

interface MediaPublishBadgeProps {
  request: ActivityRequest;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const MediaPublishBadge: React.FC<MediaPublishBadgeProps> = ({
  request,
  className = '',
  onClick,
  interactive = false,
}) => {
  const isPublished = Boolean(request.xPlatformPublish && request.prStatus === 'published_pr');
  const isPending = Boolean(request.xPlatformPublish && request.prStatus !== 'published_pr');

  let badgeClasses = '';
  let dotClasses = '';
  let icon = null;
  let label = '';
  let tooltip = '';

  if (isPublished) {
    badgeClasses =
      'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs';
    dotClasses = 'bg-emerald-500 ring-2 ring-emerald-200';
    icon = <Check className="w-3 h-3 text-emerald-700 shrink-0" />;
    label = 'تم النشر إعلامياً';
    tooltip = request.prPublishedAt
      ? `تم النشر في منصة X بتاريخ ${request.prPublishedAt}`
      : 'تم النشر إعلامياً في حساب الكلية بمنصة X';
  } else if (isPending) {
    badgeClasses =
      'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs';
    dotClasses = 'bg-amber-500 ring-2 ring-amber-200 animate-pulse';
    icon = <Clock className="w-3 h-3 text-amber-700 shrink-0" />;
    label = 'جارٍ النشر';
    tooltip = 'مطلوب إعلان رسمي في منصة X • قيد التجهيز من وحدة العلاقات العامة';
  } else {
    // Red styling for "غير مطلوب" as requested: "غير مطلوب ⚪هذا الون يمثل الاحمر"
    badgeClasses =
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 shadow-2xs';
    dotClasses = 'bg-rose-500 ring-2 ring-rose-200';
    icon = <Ban className="w-3 h-3 text-rose-600 shrink-0" />;
    label = 'غير مطلوب';
    tooltip = 'غير مطلوب للنشر الإعلامي في منصة X (سجل مهاري فقط)';
  }

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all duration-150 select-none ${badgeClasses} ${
        onClick || interactive ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
    >
      <span className="font-mono text-[10px] text-slate-800 font-extrabold flex items-center leading-none">
        𝕏
      </span>
      <span className="text-slate-300 text-[10px] leading-none">•</span>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses} shrink-0`} />
      <span className="truncate">{label}</span>
      {isPublished && (request.prCoverageUrl || (request.prNotes && request.prNotes.startsWith('http'))) && (
        <ExternalLink className="w-3 h-3 text-emerald-700 shrink-0 opacity-70" />
      )}
    </Tag>
  );
};
