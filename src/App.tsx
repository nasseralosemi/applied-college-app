import { useState, useEffect } from 'react';
import { ActivityRequest, UserRole, SystemUser, UserProfile, AuditLogEntry, AttendanceSheet } from './types';
import { INITIAL_REQUESTS, DEFAULT_USERS, ROLE_PROFILES, INITIAL_AUDIT_LOGS } from './data';
import { AppHeader } from './components/AppHeader';
import { LoginView } from './components/LoginView';
import { EmployeeView } from './components/EmployeeView';
import { ManagerView } from './components/ManagerView';
import { AuditorView } from './components/AuditorView';
import { UploaderView } from './components/UploaderView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { PRDashboardView } from './components/PRDashboardView';
import { DeanExecutiveDashboardView } from './components/DeanExecutiveDashboardView';
import { ReturnNoteModal } from './components/ReturnNoteModal';
import { StoreReadinessModal } from './components/StoreReadinessModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Requests State
  const [requests, setRequests] = useState<ActivityRequest[]>(() => {
    try {
      const saved = localStorage.getItem('app_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: ActivityRequest) => {
            const initialMatch = INITIAL_REQUESTS.find((init) => init.id === r.id);
            return {
              ...r,
              prStatus: r.prStatus || (r.xPlatformPublish ? 'pending_pr' : undefined),
              attendanceSheet: r.attendanceSheet || initialMatch?.attendanceSheet,
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_REQUESTS;
  });

  // Users State (Persisted in localStorage with auto-migration to include official PR & Dean accounts)
  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('app_users_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Check legacy storage and migrate
      const oldSaved = localStorage.getItem('app_users_v4') || localStorage.getItem('app_users');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: SystemUser) => p.id));
          const existingEmpNums = new Set(parsed.map((p: SystemUser) => p.employeeNumber));
          const missingDefaults = DEFAULT_USERS.filter(
            (d) => !existingIds.has(d.id) && !existingEmpNums.has(d.employeeNumber)
          );
          return [...parsed, ...missingDefaults];
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USERS;
  });

  // Audit Logs State (Persisted in localStorage)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('app_audit_logs_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Current authenticated user and role
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('login');

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);

  // Return modal state
  const [returnModalState, setReturnModalState] = useState<{
    isOpen: boolean;
    requestId: number | null;
    targetRole: 'emp' | 'manager';
    title: string;
  }>({
    isOpen: false,
    requestId: null,
    targetRole: 'emp',
    title: '',
  });

  // Save requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_requests', JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save requests:', e);
    }
  }, [requests]);

  // Save users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_users_v5', JSON.stringify(users));
      localStorage.setItem('app_users_v4', JSON.stringify(users));
      localStorage.setItem('app_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }, [users]);

  // Save audit logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_audit_logs_v3', JSON.stringify(auditLogs));
      localStorage.setItem('app_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to save audit logs:', e);
    }
  }, [auditLogs]);

  const addAuditLog = (
    action: string,
    actor: string,
    target: string,
    type: AuditLogEntry['type']
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      actor,
      target,
      timestamp: 'الآن',
      type,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    // Disable all direct notifications and alerts for College President (Dean) account (view-only mode)
    if (currentRole === 'dean' || currentUser?.role === 'dean') {
      return;
    }
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  };

  // Login handler
  const handleLoginSuccess = (user: SystemUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    showToast(`مرحباً بك د./أ. ${user.name}! تم الدخول بنجاح`, 'success');
  };

  // Logout handler - Single exit point to return to login screen
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('login');
    showToast('تم تسجيل الخروج بنجاح والعودة لشاشة الدخول', 'info');
  };

  // Employee: Submit new request
  const handleSubmitRequest = (
    newReqData: Omit<ActivityRequest, 'id' | 'status' | 'note'>
  ) => {
    const newReq: ActivityRequest = {
      id: Date.now(),
      ...newReqData,
      status: 'pending_manager',
      note: '',
      submittedByEmpNumber: currentUser?.employeeNumber || '4412098',
    };

    setRequests((prev) => [newReq, ...prev]);
    addAuditLog(
      'تقديم استمارة نشاط مهاري جديد للاعتماد',
      currentUser?.name || 'مقدم النشاط',
      newReq.name,
      'create'
    );
    showToast('تم رفع استمارة النشاط للمدير المباشر بنجاح!', 'success');
  };

  // Employee: Resubmit returned request
  const handleResubmit = (id: number) => {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'pending_manager', note: '' } : r
      )
    );
    addAuditLog(
      'إعادة تقديم الطلب بعد استيفاء الملاحظات',
      currentUser?.name || 'مقدم النشاط',
      req?.name || `النشاط #${id}`,
      'create'
    );
    showToast('تمت إعادة إرسال الطلب بعد التعديل للمدير المباشر', 'success');
  };

  // Manager: Approve
  const handleManagerApprove = (id: number) => {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'pending_auditor', note: '' } : r
      )
    );
    addAuditLog(
      'موافقة واعتماد المدير المباشر وتمرير الطلب للتدقيق',
      currentUser?.name || 'المدير المباشر',
      req?.name || `النشاط #${id}`,
      'approve'
    );
    showToast('تم اعتماد النشاط وتمريره لمسؤول التدقيق والاعتماد!', 'success');
  };

  // Manager: Open return modal
  const handleManagerReturnClick = (id: number) => {
    setReturnModalState({
      isOpen: true,
      requestId: id,
      targetRole: 'emp',
      title: 'إرجاع الطلب للموظف مع الملاحظات',
    });
  };

  // Auditor: Update request fields
  const handleUpdateRequest = (updatedReq: ActivityRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
    );
    addAuditLog(
      'تعديل وتدقيق حقول استمارة النشاط',
      currentUser?.name || 'مسؤول التدقيق',
      updatedReq.name,
      'user_edit'
    );
    showToast('تم حفظ وتحديث بيانات استمارة النشاط بنجاح!', 'success');
  };

  // Auditor: Certify Dean approval
  const handleDeanApprove = (id: number) => {
    const req = requests.find((r) => r.id === id);
    const today = new Date().toISOString().split('T')[0];
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              deanApproved: true,
              deanApprovalDate: today,
            }
          : r
      )
    );
    addAuditLog(
      'توثيق الاعتماد الإداري من سعادة رئيس الكلية التطبيقية',
      'سعادة رئيس الكلية التطبيقية',
      req?.name || `النشاط #${id}`,
      'approve'
    );
    showToast('تم توثيق اعتماد سعادة رئيس الكلية رسمياً للنشاط!', 'success');
  };

  // Auditor: Final Approve with Smart Dispatch
  const handleAuditorFinalApproveWithDispatch = (payload: {
    requestId: number;
    assignedUploader: string;
    xPlatformPublish: boolean;
    uploaderInstructions: string;
  }) => {
    const req = requests.find((r) => r.id === payload.requestId);
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === payload.requestId
          ? {
              ...r,
              status: 'approved_final',
              deanApproved: true,
              deanApprovalDate: r.deanApprovalDate || today,
              assignedUploader: payload.assignedUploader,
              xPlatformPublish: payload.xPlatformPublish,
              uploaderInstructions: payload.uploaderInstructions,
              prStatus: payload.xPlatformPublish ? (r.prStatus || 'pending_pr') : undefined,
              prSentAt: payload.xPlatformPublish ? (r.prSentAt || nowIso) : undefined,
              note: '',
            }
          : r
      )
    );

    addAuditLog(
      `اعتماد نهائي وتوجيه للرفع على ارتقاء (المكلف: ${payload.assignedUploader})`,
      currentUser?.name || 'مسؤول التدقيق والاعتماد',
      req?.name || `النشاط #${payload.requestId}`,
      'approve'
    );

    if (payload.xPlatformPublish) {
      addAuditLog(
        'إرسال نسخة آلية لمعلومات النشاط إلى وحدة العلاقات العامة للإعلان في منصة X',
        currentUser?.name || 'مسؤول التدقيق والاعتماد',
        req?.name || `النشاط #${payload.requestId}`,
        'approve'
      );
    }

    showToast(
      payload.xPlatformPublish
        ? 'تم الاعتماد النهائي، وتوجيه النشاط للرفع، وإرسال نسخة آلية لوحدة العلاقات العامة للنشر في منصة X!'
        : 'تم الاعتماد النهائي وتوجيه النشاط للموظف المختص للرفع على ارتقاء!',
      'success'
    );
  };

  // PR: Update tweet draft and publication status
  const handleUpdatePrStatus = (
    requestId: number,
    prStatus: 'pending_pr' | 'published_pr',
    tweetDraft?: string,
    prNotes?: string
  ) => {
    const req = requests.find((r) => r.id === requestId);
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              prStatus,
              prPublishedAt: prStatus === 'published_pr' ? (r.prPublishedAt || nowIso) : undefined,
              prTweetDraft: tweetDraft !== undefined ? tweetDraft : r.prTweetDraft,
              prNotes: prNotes !== undefined ? prNotes : r.prNotes,
            }
          : r
      )
    );

    addAuditLog(
      prStatus === 'published_pr'
        ? 'توثيق نشر النشاط في الحساب الرسمي للكلية بمنصة X'
        : 'تحديث مسودة التغريدة الرسمية للنشاط',
      currentUser?.name || 'وحدة العلاقات العامة والإعلام',
      req?.name || `النشاط #${requestId}`,
      prStatus === 'published_pr' ? 'upload' : 'user_edit'
    );

    showToast(
      prStatus === 'published_pr'
        ? 'تم توثيق نشر النشاط في الحساب الرسمي للكلية على منصة X بنجاح!'
        : 'تم حفظ مسودة تغريدة النشاط بنجاح',
      'success'
    );
  };

  // Auditor: Return request to Manager or Employee
  const handleAuditorReturn = (
    id: number,
    targetRole: 'manager' | 'emp',
    note: string
  ) => {
    const req = requests.find((r) => r.id === id);
    const newStatus = targetRole === 'emp' ? 'returned_emp' : 'returned_manager';
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, note } : r))
    );
    addAuditLog(
      targetRole === 'emp' ? 'إرجاع الطلب لمقدم النشاط للاستيفاء' : 'إرجاع الطلب للمدير المباشر',
      currentUser?.name || 'مسؤول التدقيق والاعتماد',
      req?.name || `النشاط #${id}`,
      'return'
    );
    showToast(
      targetRole === 'emp'
        ? 'تم إرجاع الطلب لمقدم النشاط (الموظف) مع الملاحظات'
        : 'تم إرجاع الطلب للمدير المباشر مع الملاحظات',
      'warning'
    );
  };

  // Auditor: Approve final (legacy fallback)
  const handleAuditorApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'approved_final', note: '' } : r
      )
    );
    showToast('تم اعتماد النشاط من رئيس الكلية، وجاهز للرفع على ارتقاء!', 'success');
  };

  // Auditor: Open return to manager modal
  const handleAuditorReturnClick = (id: number) => {
    setReturnModalState({
      isOpen: true,
      requestId: id,
      targetRole: 'manager',
      title: 'إرجاع الطلب للمدير المباشر مع الملاحظات',
    });
  };

  // Handle return note submission
  const handleConfirmReturn = (note: string) => {
    const { requestId, targetRole } = returnModalState;
    if (!requestId) return;

    const newStatus = targetRole === 'emp' ? 'returned_emp' : 'returned_manager';

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: newStatus, note } : r
      )
    );

    setReturnModalState({
      isOpen: false,
      requestId: null,
      targetRole: 'emp',
      title: '',
    });

    showToast(
      targetRole === 'emp'
        ? 'تم إرجاع الطلب لمقدم النشاط مع الملاحظة'
        : 'تم إرجاع الطلب للمدير المباشر للمراجعة',
      'warning'
    );
  };

  // Uploader: Confirm upload
  const handleConfirmUpload = (id: number) => {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'uploaded_irtqaa' } : r
      )
    );
    addAuditLog(
      'توثيق ومزامنة النشاط في منصة ارتقاء الرسمية',
      currentUser?.name || 'مسؤول الرفع لمنصة ارتقاء',
      req?.name || `النشاط #${id}`,
      'upload'
    );
    showToast('تم تأكيد رفع النشاط إلى منصة ارتقاء الرسمية بنجاح!', 'success');
  };

  // Employee: Upload or re-upload attendance sheet for ended activity
  const handleUploadAttendance = (requestId: number, sheetData: AttendanceSheet) => {
    const req = requests.find((r) => r.id === requestId);
    const isReupload = req?.attendanceSheet?.status === 'returned';

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              attendanceSheet: sheetData,
            }
          : r
      )
    );

    addAuditLog(
      isReupload
        ? 'إعادة رفع كشف الحضور المحدث بعد استيفاء ملاحظات مسؤول الرفع'
        : 'رفع كشف الحضور الختامي للنشاط للاعتماد والتوثيق',
      currentUser?.name || 'مقدم النشاط',
      req?.name || `النشاط #${requestId}`,
      'upload'
    );

    showToast(
      isReupload
        ? 'تمت إعادة رفع كشف الحضور المحدث بنجاح وإحالته لمسؤول الرفع!'
        : 'تم رفع كشف الحضور بنجاح وبانتظار اعتماد مسؤول منصة ارتقاء!',
      'success'
    );
  };

  // Uploader: Accept and approve attendance sheet (officially close transaction)
  const handleApproveAttendance = (requestId: number) => {
    const req = requests.find((r) => r.id === requestId);
    const nowIso = new Date().toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              isOfficiallyClosed: true,
              attendanceSheet: r.attendanceSheet
                ? {
                    ...r.attendanceSheet,
                    status: 'approved',
                    approvedAt: nowIso,
                    approvedBy: currentUser?.name || 'مسؤول الرفع والتوثيق',
                  }
                : undefined,
            }
          : r
      )
    );

    addAuditLog(
      'قبول واعتماد كشف الحضور وتوثيق النشاط وإغلاق المعاملة رسمياً',
      currentUser?.name || 'مسؤول الرفع والتوثيق (منصة ارتقاء)',
      req?.name || `النشاط #${requestId}`,
      'approve'
    );

    showToast('تم قبول واعتماد كشف الحضور رسمياً وتوثيق النشاط وإغلاق المعاملة بنجاح!', 'success');
  };

  // Uploader: Return attendance sheet to employee with mandatory note
  const handleReturnAttendance = (requestId: number, note: string) => {
    const req = requests.find((r) => r.id === requestId);
    const nowIso = new Date().toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              attendanceSheet: r.attendanceSheet
                ? {
                    ...r.attendanceSheet,
                    status: 'returned',
                    returnNote: note,
                    returnedAt: nowIso,
                  }
                : undefined,
            }
          : r
      )
    );

    addAuditLog(
      `إعادة كشف الحضور للموظف للتعديل: "${note}"`,
      currentUser?.name || 'مسؤول الرفع والتوثيق (منصة ارتقاء)',
      req?.name || `النشاط #${requestId}`,
      'return'
    );

    showToast('تمت إعادة كشف الحضور للموظف مع الملاحظات المحددة', 'warning');
  };

  // Admin Actions
  const handleAddUser = (newUserData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const newUser: SystemUser = {
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...newUserData,
    };
    setUsers((prev) => [newUser, ...prev]);
    addAuditLog(
      'إنشاء حساب مستخدم جديد وتعيين الصلاحيات',
      currentUser?.name || 'مدير النظام',
      `حساب: ${newUser.name} (#${newUser.employeeNumber})`,
      'create'
    );
    showToast(`تم إنشاء حساب "${newUser.name}" بنجاح!`, 'success');
  };

  const handleUpdateUser = (updatedUser: SystemUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addAuditLog(
      `تعديل بيانات المستخدم (${updatedUser.name})`,
      currentUser?.name || 'مدير النظام',
      `رقم وظيفي: #${updatedUser.employeeNumber} - ${updatedUser.department}`,
      'user_edit'
    );
    showToast(`تم حفظ تعديلات حساب "${updatedUser.name}" بنجاح!`, 'success');
  };

  const handleUpdateUserRole = (userId: string, newRole: Exclude<UserRole, 'login'>) => {
    const targetUser = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    // If the logged in user was updated, reflect immediately
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
      setCurrentRole(newRole);
    }
    addAuditLog(
      `تحديث صلاحية ورتبة المستخدم في النظام`,
      currentUser?.name || 'مدير النظام',
      `حساب: ${targetUser?.name || userId}`,
      'user_edit'
    );
    showToast('تم تحديث صلاحية ورتبة المستخدم بنجاح!', 'success');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = !u.isActive;
          showToast(
            updated ? `تم تفعيل حساب ${u.name}` : `تم تعطيل حساب ${u.name}`,
            updated ? 'success' : 'warning'
          );
          addAuditLog(
            updated ? 'تفعيل حساب المستخدم' : 'تعطيل حساب المستخدم',
            currentUser?.name || 'مدير النظام',
            `حساب: ${u.name} (#${u.employeeNumber})`,
            'status_toggle'
          );
          return { ...u, isActive: updated };
        }
        return u;
      })
    );
  };

  const handleResetUserPassword = (userId: string, newPass: string) => {
    const targetUser = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPass } : u))
    );
    addAuditLog(
      'إعادة تعيين كلمة المرور وتوليد كلمة مؤقتة',
      currentUser?.name || 'مدير النظام',
      `حساب: ${targetUser?.name || userId} (#${targetUser?.employeeNumber || ''})`,
      'password_reset'
    );
    showToast('تمت إعادة تعيين وتوليد كلمة المرور بنجاح!', 'success');
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addAuditLog(
      'حذف حساب مستخدم من النظام',
      currentUser?.name || 'مدير النظام',
      `حساب: ${targetUser?.name || userId}`,
      'user_edit'
    );
    showToast('تم حذف المستخدم من سجلات النظام', 'info');
  };

  // Dynamic user profile for AppHeader
  const currentProfile: UserProfile | null = currentUser
    ? {
        name: currentUser.name,
        roleTitle: ROLE_PROFILES[currentUser.role]?.roleTitle || 'عضو الكلية',
        roleBadge: ROLE_PROFILES[currentUser.role]?.roleBadge || 'معتمد',
        avatarText: currentUser.name.split(' ').slice(0, 2).map((w) => w[0]).join(' ') || 'ع',
        employeeNumber: currentUser.employeeNumber,
        department: currentUser.department,
        roleKey: currentUser.role,
      }
    : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#f8fafc] flex flex-col text-slate-800 antialiased font-['Tajawal',sans-serif]"
    >
      {/* App Container - Unified Wide Layout for all views */}
      <div
        className={`w-full ${
          currentRole === 'login' ? 'max-w-md' : 'max-w-4xl'
        } mx-auto flex flex-col bg-[#f8fafc] relative shadow-none transition-all duration-200 ${
          currentRole !== 'login' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'
        }`}
      >
        {/* In-app Toast */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Header (Hidden in Login View) - Dedicated Logout is the single return path */}
        {currentRole !== 'login' && currentProfile && (
          <AppHeader
            profile={currentProfile}
            onLogout={handleLogout}
            requests={requests}
            onOpenAndroidInstall={() => setIsAndroidModalOpen(true)}
          />
        )}

        {/* Scrollable Main Content - Strict Role-Based Access Control (RBAC) */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
          {currentRole === 'login' && (
            <LoginView users={users} onLoginSuccess={handleLoginSuccess} />
          )}

          {currentRole === 'emp' && (
            <EmployeeView
              requests={requests}
              onSubmitRequest={handleSubmitRequest}
              onResubmitRequest={handleResubmit}
              onUploadAttendance={handleUploadAttendance}
              currentUserEmpNumber={currentUser?.employeeNumber}
            />
          )}

          {currentRole === 'manager' && (
            <ManagerView
              requests={requests}
              onApprove={handleManagerApprove}
              onReturnClick={handleManagerReturnClick}
            />
          )}

          {currentRole === 'auditor' && (
            <AuditorView
              requests={requests}
              onUpdateRequest={handleUpdateRequest}
              onDeanApprove={handleDeanApprove}
              onFinalApproveWithDispatch={handleAuditorFinalApproveWithDispatch}
              onReturnClick={handleAuditorReturn}
            />
          )}

          {currentRole === 'uploader' && (
            <UploaderView
              requests={requests}
              onConfirmUpload={handleConfirmUpload}
              onApproveAttendance={handleApproveAttendance}
              onReturnAttendance={handleReturnAttendance}
            />
          )}

          {/* PR Dashboard (Direct PR User) */}
          {currentRole === 'pr' && (
            <PRDashboardView
              requests={requests}
              onUpdatePrStatus={handleUpdatePrStatus}
            />
          )}

          {/* Dean Executive Dashboard (Direct Dean User) */}
          {currentRole === 'dean' && (
            <DeanExecutiveDashboardView
              requests={requests}
            />
          )}

          {currentRole === 'admin' && (
            <AdminDashboardView
              users={users}
              requests={requests}
              auditLogs={auditLogs}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleUserStatus={handleToggleUserStatus}
              onResetUserPassword={handleResetUserPassword}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Return Note Modal Dialog */}
      <ReturnNoteModal
        isOpen={returnModalState.isOpen}
        title={returnModalState.title}
        targetRoleLabel={
          returnModalState.targetRole === 'emp'
            ? 'الموظف / مقدم النشاط'
            : 'المدير المباشر'
        }
        onConfirm={handleConfirmReturn}
        onCancel={() =>
          setReturnModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Store Deployment Readiness Modal */}
      <StoreReadinessModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      {/* Direct Android Install & WebAPK Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
    </div>
  );
}
