import React, { useState } from 'react';
import { ActivityRequest, SystemUser, UserRole } from '../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  CloudUpload,
  Award,
  Calendar,
  Building2,
  ChevronLeft,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { RequestDetailsModal } from './RequestDetailsModal';

export interface AppNotification {
  id: string;
  requestId?: number;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'success' | 'info' | 'warning';
  read: boolean;
  category: 'status_change' | 'action_required' | 'closure' | 'general';
}

interface Props {
  requests: ActivityRequest[];
  currentUser: SystemUser | null;
  currentRole: UserRole;
  onNavigateToRequest?: (requestId: number) => void;
}

export const NotificationsView: React.FC<Props> = ({
  requests,
  currentUser,
  currentRole,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Generate role-specific notifications dynamically
  const notifications: AppNotification[] = [];

  requests.forEach((r) => {
    // 1. Employee specific notifications
    if (currentRole === 'emp') {
      const isMyRequest =
        !currentUser?.employeeNumber ||
        r.presenter?.includes(currentUser.name) ||
        r.branch === currentUser.branch ||
        r.unit === currentUser.department;

      if (isMyRequest) {
        if (r.status === 'returned_emp') {
          notifications.push({
            id: `ret-${r.id}`,
            requestId: r.id,
            title: `إرجاع نشاط للتعديل: ${r.name}`,
            message: r.note
              ? `أعاد المدير المباشر المعاملة مع الملاحظة: "${r.note}"`
              : 'أعاد المدير المباشر المعاملة لاستيفاء الملاحظات والتعديل.',
            timestamp: r.managerApprovalDate || 'اليوم',
            type: 'urgent',
            read: readIds.has(`ret-${r.id}`),
            category: 'action_required',
          });
        }

        if (r.attendanceSheet?.status === 'returned') {
          notifications.push({
            id: `att-ret-${r.id}`,
            requestId: r.id,
            title: `كشف الحضور معاد للتعديل: ${r.name}`,
            message: r.attendanceSheet.returnNote
              ? `أعاد رافع ارتقاء كشف الحضور: "${r.attendanceSheet.returnNote}"`
              : 'يلزم إعادة رفع كشف الحضور المستوفي للشروط.',
            timestamp: r.attendanceSheet.returnedAt || 'مؤخراً',
            type: 'urgent',
            read: readIds.has(`att-ret-${r.id}`),
            category: 'action_required',
          });
        }

        if (r.attendanceSheet?.status === 'approved' || r.isOfficiallyClosed) {
          notifications.push({
            id: `closed-${r.id}`,
            requestId: r.id,
            title: `اكتمال وتوثيق المعاملة: ${r.name}`,
            message: 'تم اعتماد كشف الحضور والغياب رسمياً وإغلاق المعاملة وإدراجها بالسجل الوطني المعتمد.',
            timestamp: r.attendanceSheet?.approvedAt || 'مؤخراً',
            type: 'success',
            read: readIds.has(`closed-${r.id}`),
            category: 'closure',
          });
        }

        if (r.status === 'uploaded_irtqaa') {
          notifications.push({
            id: `irtqaa-${r.id}`,
            requestId: r.id,
            title: `تم الرفع لمنصة ارتقاء: ${r.name}`,
            message: r.irtqaaAccreditationNumber
              ? `تم توثيق النشاط برقم اعتماد (#${r.irtqaaAccreditationNumber}). يرجى رفع كشف الحضور بعد انتهاء النشاط.`
              : 'تم اعتماد النشاط ورفعه على منصة ارتقاء بنجاح.',
            timestamp: r.uploadedAt || 'مؤخراً',
            type: 'success',
            read: readIds.has(`irtqaa-${r.id}`),
            category: 'status_change',
          });
        }

        if (r.deanApproved) {
          notifications.push({
            id: `dean-${r.id}`,
            requestId: r.id,
            title: `اعتماد سعادة رئيس الكلية: ${r.name}`,
            message: 'تم توثيق الاعتماد الإداري لساعات النشاط من سعادة رئيس الكلية التطبيقية.',
            timestamp: r.deanApprovalDate || 'مؤخراً',
            type: 'info',
            read: readIds.has(`dean-${r.id}`),
            category: 'status_change',
          });
        }

        if (r.status === 'pending_auditor') {
          notifications.push({
            id: `aud-${r.id}`,
            requestId: r.id,
            title: `موافقة المدير المباشر: ${r.name}`,
            message: `وافق المدير المباشر (${r.coordinatorName || 'المدير'}) على النشاط، والمعاملة الآن قيد تدقيق الكلية.`,
            timestamp: r.managerApprovalDate || 'مؤخراً',
            type: 'info',
            read: readIds.has(`aud-${r.id}`),
            category: 'status_change',
          });
        }
      }
    }

    // 2. Manager specific notifications
    if (currentRole === 'manager') {
      if (r.status === 'pending_manager') {
        notifications.push({
          id: `mgr-req-${r.id}`,
          requestId: r.id,
          title: `طلب اعتماد جديد: ${r.name}`,
          message: `رفع الموظف (${r.presenter}) استمارة نشاط جديدة بحاجة لمراجعتك واعتمادك المبدئي.`,
          timestamp: r.startDate || 'اليوم',
          type: 'warning',
          read: readIds.has(`mgr-req-${r.id}`),
          category: 'action_required',
        });
      }

      if (r.status === 'returned_manager') {
        notifications.push({
          id: `mgr-ret-${r.id}`,
          requestId: r.id,
          title: `إحالة من التدقيق للمراجعة: ${r.name}`,
          message: r.note ? `ملاحظة المدقق: "${r.note}"` : 'تمت إعادة الطلب من التدقيق للمراجعة.',
          timestamp: 'اليوم',
          type: 'urgent',
          read: readIds.has(`mgr-ret-${r.id}`),
          category: 'action_required',
        });
      }
    }

    // 3. Auditor specific notifications
    if (currentRole === 'auditor') {
      if (r.status === 'pending_auditor') {
        notifications.push({
          id: `audit-pend-${r.id}`,
          requestId: r.id,
          title: `معاملة بانتظار التدقيق: ${r.name}`,
          message: `تم اعتماد النشاط من المدير المباشر (${r.coordinatorName || 'معتمد'})، بانتظار التدقيق والتوجيه لمنصة ارتقاء.`,
          timestamp: r.managerApprovalDate || 'اليوم',
          type: 'warning',
          read: readIds.has(`audit-pend-${r.id}`),
          category: 'action_required',
        });
      }
    }

    // 4. Uploader specific notifications
    if (currentRole === 'uploader') {
      if (r.status === 'approved_final') {
        notifications.push({
          id: `up-fin-${r.id}`,
          requestId: r.id,
          title: `معاملة معتمدة جاهزة للرفع: ${r.name}`,
          message: 'تم إنهاء كافة مراحل التدقيق والاعتماد، المعاملة جاهزة لإدخال رقم الاعتماد على ارتقاء.',
          timestamp: 'مؤخراً',
          type: 'warning',
          read: readIds.has(`up-fin-${r.id}`),
          category: 'action_required',
        });
      }

      if (r.attendanceSheet?.status === 'pending_review') {
        notifications.push({
          id: `up-att-${r.id}`,
          requestId: r.id,
          title: `كشف حضور مرفوع بانتظار المراجعة: ${r.name}`,
          message: 'قام مقدم النشاط برفع كشف الحضور والغياب الختامي، يرجى المراجعة والاعتماد أو الإرجاع.',
          timestamp: r.attendanceSheet.uploadedAt || 'مؤخراً',
          type: 'warning',
          read: readIds.has(`up-att-${r.id}`),
          category: 'action_required',
        });
      }
    }

    // 5. PR specific notifications
    if (currentRole === 'pr') {
      if (r.xPlatformPublish && r.prStatus !== 'published_pr') {
        notifications.push({
          id: `pr-pend-${r.id}`,
          requestId: r.id,
          title: `نشاط بانتظار النشر بمنصة X: ${r.name}`,
          message: 'تم توجيه النشاط رسمياً للنشر والتغطية الإعلامية من قبل إدارة الكلية.',
          timestamp: r.prSentAt || 'مؤخراً',
          type: 'warning',
          read: readIds.has(`pr-pend-${r.id}`),
          category: 'action_required',
        });
      }
    }
  });

  const markAllAsRead = () => {
    const all = new Set(readIds);
    notifications.forEach((n) => all.add(n.id));
    setReadIds(all);
  };

  const handleNotificationClick = (n: AppNotification) => {
    setReadIds((prev) => new Set(prev).add(n.id));
    if (n.requestId) {
      const found = requests.find((r) => r.id === n.requestId);
      if (found) {
        setSelectedRequest(found);
      }
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'urgent') return n.type === 'urgent';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4 pb-12 font-['Tajawal',sans-serif] text-right">
      {/* Top Banner */}
      <div className="bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(70,82,59,0.06)] border border-[#46523B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-b from-[#46523B] via-[#A08D52] to-[#46523B]" />
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#46523B]/10 text-[#46523B] flex items-center justify-center shrink-0 border border-[#46523B]/20">
            <Bell className="w-5 h-5 text-[#A08D52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#46523B]/10 text-[#46523B]">
                مركز التنبيهات
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#46523B]">
                إشعارات المعاملات والمسار الإداري
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              تنبيهات حية حول حالة طلباتك، الاعتمادات، والتوجيهات الإدارية المباشرة
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#46523B] transition cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-[#A08D52]" />
            <span>تعيين الكل كمقروء</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#46523B] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جميع الإشعارات ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'unread'
                ? 'bg-[#46523B] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            غير المقروءة ({unreadCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'urgent'
                ? 'bg-rose-600 text-white shadow-xs font-black'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            تنبيهات هامة
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          مزامنة سحابية لحظية
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[32px] p-10 text-center border border-[#46523B]/10 shadow-sm">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-[32px] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-800 mb-1">
              لا توجد إشعارات جديدة
            </h3>
            <p className="text-xs text-slate-500">
              جميع معاملاتك ومساراتك الإدارية محدثة ولا تتطلب أي إجراءات إضافية حالياً.
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`bg-white rounded-[32px] p-4 sm:p-5 border transition-all duration-150 cursor-pointer relative overflow-hidden select-none ${
                  !n.read
                    ? 'border-[#A08D52]/40 shadow-sm bg-gradient-to-r from-amber-50/20 via-white to-white'
                    : 'border-slate-200/80 hover:border-[#46523B]/30'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#A08D52]" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      n.type === 'urgent'
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : n.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : n.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-[#46523B]/10 border-[#46523B]/20 text-[#46523B]'
                    }`}
                  >
                    {n.type === 'urgent' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : n.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : n.type === 'warning' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5 text-[#A08D52]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {n.message}
                    </p>

                    {n.requestId && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
                        <span>عرض تفاصيل المعاملة</span>
                        <ChevronLeft className="w-3.5 h-3.5 text-[#A08D52]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal on Notification click */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        viewerRole={currentRole as any}
      />
    </div>
  );
};

export default NotificationsView;
