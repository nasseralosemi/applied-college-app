import { useState, useEffect } from 'react';
import { ActivityRequest, UserRole, SystemUser, UserProfile, AuditLogEntry } from './types';
import { INITIAL_REQUESTS, DEFAULT_USERS, ROLE_PROFILES, INITIAL_AUDIT_LOGS } from './data';
import { AppHeader } from './components/AppHeader';
import { LoginView } from './components/LoginView';
import { EmployeeView } from './components/EmployeeView';
import { ManagerView } from './components/ManagerView';
import { AuditorView } from './components/AuditorView';
import { UploaderView } from './components/UploaderView';
import { AdminDashboardView } from './components/AdminDashboardView';
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
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_REQUESTS;
  });

  // Users State (Persisted in localStorage with auto-migration to official users)
  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('app_users_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Check legacy storage and migrate default accounts to official names
      const oldSaved = localStorage.getItem('app_users');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep custom non-default users created by admin, but update default users to official matrix
          const customUsers = parsed.filter(
            (p: SystemUser) =>
              !DEFAULT_USERS.some(
                (d) =>
                  d.id === p.id ||
                  d.employeeNumber === p.employeeNumber ||
                  (d.role === p.role && d.role === 'admin')
              )
          );
          return [...DEFAULT_USERS, ...customUsers];
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
    showToast('تم الاعتماد النهائي وتوجيه النشاط للموظف المختص للرفع على ارتقاء!', 'success');
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
      {/* App Container - Full Screen Mobile Layout with Independent Scroll */}
      <div
        className={`w-full max-w-xl mx-auto flex flex-col bg-[#f8fafc] relative shadow-none ${
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
