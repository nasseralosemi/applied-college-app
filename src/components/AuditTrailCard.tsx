import React from 'react';
import { AuditLogEntry } from '../types';
import {
  History,
  CloudUpload,
  CheckCircle2,
  Undo2,
  UserCog,
  KeyRound,
  Power,
  FilePlus,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  logs: AuditLogEntry[];
}

export const AuditTrailCard: React.FC<Props> = ({ logs }) => {
  const latestFive = logs.slice(0, 5);

  const getLogIcon = (type: AuditLogEntry['type']) => {
    switch (type) {
      case 'upload':
        return <CloudUpload className="w-3.5 h-3.5 text-emerald-600" />;
      case 'approve':
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
      case 'return':
        return <Undo2 className="w-3.5 h-3.5 text-rose-600" />;
      case 'user_edit':
        return <UserCog className="w-3.5 h-3.5 text-blue-600" />;
      case 'password_reset':
        return <KeyRound className="w-3.5 h-3.5 text-amber-600" />;
      case 'status_toggle':
        return <Power className="w-3.5 h-3.5 text-purple-600" />;
      case 'create':
        return <FilePlus className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getLogBadgeStyle = (type: AuditLogEntry['type']) => {
    switch (type) {
      case 'upload':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'approve':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'return':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'user_edit':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'password_reset':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'status_toggle':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'create':
        return 'bg-teal-50 border-teal-200 text-teal-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-md text-right font-['Tajawal',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shadow-xs">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1b4332]">
                سجل العمليات المصغر (Audit Trail)
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>مباشر Live</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              يعرض آخر 5 إجراءات موثقة تمت على المنصة لحوكمة العمليات
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
          آخر 5 عمليات
        </span>
      </div>

      {/* List of 5 items */}
      <div className="space-y-2">
        {latestFive.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">
            لا توجد إجراءات مسجلة في السجل حالياً
          </div>
        ) : (
          latestFive.map((log, index) => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-2.5 p-2.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition duration-150"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${getLogBadgeStyle(
                    log.type
                  )}`}
                >
                  {getLogIcon(log.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {log.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 text-[#1b4332] font-semibold">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{log.actor}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs font-medium">
                      {log.target}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-left pt-0.5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>{log.timestamp}</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono block mt-0.5 text-right">
                  #{index + 1}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
