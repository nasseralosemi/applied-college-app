import React from 'react';
import {
  Check,
  Clock,
  CloudUpload,
  AlertCircle,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';
import { ActivityRequest } from '../types';

interface WorkflowStepperProps {
  request: ActivityRequest;
  /** Current viewer role or context to customize perspective if needed */
  viewerRole?: 'employee' | 'manager' | 'uploader' | 'auditor';
  /** Mode: 4-step as requested for Auditor or 5-step detailed */
  mode?: '4-step' | '5-step';
  /** Optional container class name */
  className?: string;
  /** Whether to show the top summary badge pill (defaults to true) */
  showSummaryBadge?: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  request,
  viewerRole = 'manager',
  mode = '4-step',
  className = '',
  showSummaryBadge = true,
}) => {
  const status = request.status;

  // 1. Stage 1: تقديم الطلب (Submitted by Employee)
  const isStage1Done = true;

  // 2. Stage 2: موافقة المدير المباشر (Direct Manager Approval)
  const isStage2Returned = status === 'returned_emp';
  const isStage2Active = status === 'pending_manager' || status === 'returned_manager';
  const isStage2Done =
    !isStage2Returned &&
    !isStage2Active &&
    (status === 'pending_auditor' ||
      status === 'approved_final' ||
      status === 'uploaded_irtqaa' ||
      request.managerApprovalDate !== undefined ||
      Boolean(request.coordinatorName));

  // 3. Stage 3: التدقيق والاعتماد (Auditor / College Dean)
  const isStage3Active = status === 'pending_auditor';
  const isStage3Done = status === 'approved_final' || status === 'uploaded_irtqaa';

  // 4. Stage 4: الرفع لمنصة ارتقاء (Irtqaa Platform Upload)
  const isStage4Active = status === 'approved_final';
  const isStage4Done = status === 'uploaded_irtqaa';

  // 5. Stage 5 (if 5-step): كشف الحضور والتوثيق الختامي
  const isStage5Done =
    request.attendanceSheet?.status === 'approved' || Boolean(request.isOfficiallyClosed);
  const isStage5Returned = request.attendanceSheet?.status === 'returned';
  const isStage5Active =
    Boolean(request.attendanceSheet && request.attendanceSheet.status === 'pending_review') ||
    (status === 'uploaded_irtqaa' && !isStage5Done && !isStage5Returned);

  // Compute Summary Text & Styling
  let summaryText = 'تمت الموافقة ← قيد التدقيق لدى المراجع';
  let summaryStyle = 'bg-amber-50 text-amber-900 border-amber-200/90';

  if (status === 'returned_emp') {
    summaryText = request.editedAfterReturn
      ? 'تم تعديل الاستمارة ← بانتظار إعادة الرفع للمدير'
      : 'مُعاد للتعديل من المدير المباشر ← بانتظار استيفاء الملاحظات';
    summaryStyle = 'bg-rose-50 text-rose-900 border-rose-200';
  } else if (status === 'pending_manager' || status === 'returned_manager') {
    summaryText = status === 'returned_manager'
      ? 'مُعاد من التدقيق للمدير المباشر ← بانتظار المراجعة'
      : 'بانتظار مراجعة واعتماد المدير المباشر';
    summaryStyle = 'bg-amber-50 text-amber-900 border-amber-200/90';
  } else if (isStage5Done) {
    summaryText = 'مكتملة ومغلقة رسمياً ← تم اعتماد كشف الحضور وتوثيق المعاملة بالسجل الكامل';
    summaryStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300';
  } else if (isStage5Returned) {
    summaryText = 'كشف الحضور معاد للتعديل ← بانتظار استيفاء الموظف';
    summaryStyle = 'bg-rose-50 text-rose-900 border-rose-200';
  } else if (request.attendanceSheet?.status === 'pending_review') {
    summaryText = 'تم رفع كشف الحضور ← قيد مراجعة وتدقيق مسؤول المنصة';
    summaryStyle = 'bg-amber-50 text-amber-900 border-amber-300';
  } else if (status === 'uploaded_irtqaa') {
    summaryText = 'مرفوعة على ارتقاء ← المرحلة الختامية: بانتظار رفع كشف الحضور والغياب';
    summaryStyle = 'bg-[#46523B]/10 text-[#46523B] border-[#46523B]/20';
  } else if (status === 'approved_final') {
    summaryText = 'معتمدة نهائياً ← جاهزة للرفع لمنصة ارتقاء';
    summaryStyle = 'bg-emerald-50 text-emerald-900 border-emerald-200/90';
  } else if (status === 'pending_auditor') {
    summaryText = 'معتمدة من المدير ← قيد التدقيق والاعتماد النهائي';
    summaryStyle = 'bg-amber-50 text-amber-900 border-amber-200/90';
  }

  // Label customizations based on user perspective
  const stage2Label =
    viewerRole === 'manager'
      ? isStage2Done
        ? 'موافقتك ✓'
        : 'المدير المباشر'
      : 'المدير المباشر';

  const isFourStep = mode === '4-step';

  // Connecting progress bar width computation
  let progressBarWidth = 'w-0';
  if (isFourStep) {
    if (isStage4Done) progressBarWidth = 'w-[calc(100%-2rem)]';
    else if (isStage3Done) progressBarWidth = 'w-[66%]';
    else if (isStage2Done) progressBarWidth = 'w-[33%]';
    else progressBarWidth = 'w-0';
  } else {
    if (isStage5Done) progressBarWidth = 'w-[calc(100%-2rem)]';
    else if (isStage4Done) progressBarWidth = 'w-[75%]';
    else if (isStage3Done) progressBarWidth = 'w-[50%]';
    else if (isStage2Done) progressBarWidth = 'w-[25%]';
    else progressBarWidth = 'w-0';
  }

  return (
    <div
      className={`bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 mb-3 space-y-2.5 font-['Tajawal',sans-serif] ${className}`}
    >
      {/* 1. Timeline Status Chip */}
      {showSummaryBadge && (
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] font-bold ${summaryStyle}`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isStage5Done || isStage4Done
                    ? 'bg-emerald-400'
                    : isStage5Returned || isStage2Returned
                    ? 'bg-rose-400'
                    : status === 'approved_final'
                    ? 'bg-emerald-500'
                    : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isStage5Done || isStage4Done
                    ? 'bg-emerald-600'
                    : isStage5Returned || isStage2Returned
                    ? 'bg-rose-600'
                    : status === 'approved_final'
                    ? 'bg-emerald-600'
                    : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="truncate">المرحلة الحالية: {summaryText}</span>
          </div>
          <ArrowLeft className="w-3.5 h-3.5 opacity-60 shrink-0" />
        </div>
      )}

      {/* 2. Visual Stepper / Timeline */}
      <div className="pt-1">
        <div className="relative flex items-center justify-between">
          {/* Background connecting bar */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0 rounded-full" />

          {/* Active connecting bar */}
          <div
            className={`absolute top-1/2 right-4 -translate-y-1/2 h-1 transition-all duration-300 z-0 rounded-full bg-[#46523B] ${progressBarWidth}`}
          />

          {/* الخطوة 1: تم الرفع (مقدم الطلب) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-700 mt-1 whitespace-nowrap">
              تم الرفع
            </span>
          </div>

          {/* الخطوة 2: المدير المباشر */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                isStage2Done
                  ? 'bg-[#46523B] text-[#A08D52] ring-2 ring-emerald-100'
                  : isStage2Returned
                  ? 'bg-rose-500 text-white ring-2 ring-rose-200'
                  : isStage2Active
                  ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isStage2Done ? (
                <Check className="w-3.5 h-3.5" />
              ) : isStage2Returned ? (
                <AlertCircle className="w-3 h-3" />
              ) : isStage2Active ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                '2'
              )}
            </div>
            <span
              className={`text-[9px] mt-1 whitespace-nowrap ${
                isStage2Done
                  ? 'font-bold text-[#46523B]'
                  : isStage2Returned
                  ? 'font-bold text-rose-800'
                  : isStage2Active
                  ? 'font-bold text-amber-800'
                  : 'text-slate-400'
              }`}
            >
              {stage2Label}
            </span>
          </div>

          {/* الخطوة 3: التدقيق والاعتماد */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                isStage3Done
                  ? 'bg-emerald-600 text-white'
                  : isStage3Active
                  ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isStage3Done ? (
                <Check className="w-3.5 h-3.5" />
              ) : isStage3Active ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                '3'
              )}
            </div>
            <span
              className={`text-[9px] mt-1 whitespace-nowrap ${
                isStage3Active
                  ? 'font-bold text-amber-800'
                  : isStage3Done
                  ? 'font-bold text-[#46523B]'
                  : 'text-slate-400'
              }`}
            >
              التدقيق والاعتماد
            </span>
          </div>

          {/* الخطوة 4: منصة ارتقاء / الإنجاز */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                isStage4Done || isStage5Done
                  ? 'bg-[#46523B] text-[#A08D52] shadow-xs'
                  : isStage4Active
                  ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isStage4Done || isStage5Done ? (
                <Check className="w-3.5 h-3.5" />
              ) : isStage4Active ? (
                <CloudUpload className="w-3 h-3" />
              ) : (
                '4'
              )}
            </div>
            <span
              className={`text-[9px] mt-1 whitespace-nowrap ${
                isStage4Done || isStage5Done
                  ? 'font-bold text-[#46523B]'
                  : isStage4Active
                  ? 'font-bold text-amber-800'
                  : 'text-slate-400'
              }`}
            >
              منصة ارتقاء
            </span>
          </div>

          {/* الخطوة 5: كشف الحضور (Only if 5-step mode) */}
          {!isFourStep && (
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all ${
                  isStage5Done
                    ? 'bg-[#46523B] text-[#A08D52] ring-2 ring-[#A08D52]'
                    : isStage5Returned
                    ? 'bg-rose-500 text-white ring-2 ring-rose-200'
                    : isStage5Active
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStage5Done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isStage5Returned ? (
                  <AlertCircle className="w-3 h-3" />
                ) : isStage5Active ? (
                  <FileCheck className="w-3 h-3" />
                ) : (
                  '5'
                )}
              </div>
              <span
                className={`text-[9px] mt-1 whitespace-nowrap ${
                  isStage5Done
                    ? 'font-bold text-[#46523B]'
                    : isStage5Returned
                    ? 'font-bold text-rose-800'
                    : isStage5Active
                    ? 'font-bold text-amber-800'
                    : 'text-slate-400'
                }`}
              >
                كشف الحضور
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepper;
