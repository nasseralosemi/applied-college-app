import { useState, useEffect } from 'react';
import { ActivityRequest, UserRole } from './types';
import { INITIAL_REQUESTS, ROLE_PROFILES } from './data';
import { AppHeader } from './components/AppHeader';
import { LoginView } from './components/LoginView';
import { EmployeeView } from './components/EmployeeView';
import { ManagerView } from './components/ManagerView';
import { AuditorView } from './components/AuditorView';
import { UploaderView } from './components/UploaderView';
import { BottomNav } from './components/BottomNav';
import { ReturnNoteModal } from './components/ReturnNoteModal';
import { StoreReadinessModal } from './components/StoreReadinessModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Local storage persistence
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

  const [currentRole, setCurrentRole] = useState<UserRole>('emp');
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

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('app_requests', JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save requests to localStorage:', e);
    }
  }, [requests]);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  };

  // Switch role handler
  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole('login');
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleLogin = (role: Exclude<UserRole, 'login'>) => {
    setCurrentRole(role);
    showToast(`مرحباً بك! تم الدخول بصلاحية: ${ROLE_PROFILES[role].roleTitle}`, 'success');
  };

  // Reset demo data
  const handleResetData = () => {
    setRequests(INITIAL_REQUESTS);
    localStorage.setItem('app_requests', JSON.stringify(INITIAL_REQUESTS));
    showToast('تمت استعادة البيانات الافتراضية بنجاح', 'info');
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
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast('تم رفع استمارة النشاط للمدير المباشر بنجاح!', 'success');
  };

  // Employee: Resubmit returned request
  const handleResubmit = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'pending_manager', note: '' } : r
      )
    );
    showToast('تمت إعادة إرسال الطلب بعد التعديل للمدير المباشر', 'success');
  };

  // Manager: Approve
  const handleManagerApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'pending_auditor', note: '' } : r
      )
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

  // Auditor: Approve final
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
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'uploaded_irtqaa' } : r
      )
    );
    showToast('تم تأكيد رفع النشاط إلى منصة ارتقاء الرسمية بنجاح!', 'success');
  };

  const currentProfile = currentRole !== 'login' ? ROLE_PROFILES[currentRole] : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f0f4f2] flex items-center justify-center p-2 sm:p-4 text-slate-800 antialiased font-['Tajawal',sans-serif]"
    >
      {/* Centered Mobile Phone Frame - Single Main Element */}
      <div className="w-[360px] sm:w-[380px] h-[760px] max-h-[96vh] bg-[#f8fafc] relative flex flex-col rounded-[48px] border-[10px] border-[#1e1e1e] shadow-2xl overflow-hidden shrink-0">
        {/* Top Status Bar & Notch */}
        <div className="h-8 w-full flex justify-between px-8 items-center pt-2 select-none shrink-0 z-30 bg-transparent">
          <div className="text-[10px] font-extrabold text-gray-800 tracking-tight">9:41</div>
          {/* Center Speaker / Notch */}
          <div className="w-20 h-4 bg-[#1e1e1e] rounded-full flex items-center justify-center">
            <div className="w-8 h-1 bg-gray-800 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-2 bg-gray-900 rounded-[1.5px] border border-gray-900 flex p-[1px]">
              <div className="h-full w-2.5 bg-gray-900 rounded-[0.5px]"></div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-900 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* In-app Toast */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Header (Hidden in Login View) */}
        {currentRole !== 'login' && currentProfile && (
          <AppHeader
            profile={currentProfile}
            onLogout={handleLogout}
            requests={requests}
            onOpenAndroidInstall={() => setIsAndroidModalOpen(true)}
          />
        )}

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
          {currentRole === 'login' && <LoginView onLogin={handleLogin} />}

          {currentRole === 'emp' && (
            <EmployeeView
              requests={requests}
              onSubmitRequest={handleSubmitRequest}
              onResubmitRequest={handleResubmit}
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
              onFinalApprove={handleAuditorApprove}
              onReturnToManagerClick={handleAuditorReturnClick}
            />
          )}

          {currentRole === 'uploader' && (
            <UploaderView
              requests={requests}
              onConfirmUpload={handleConfirmUpload}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentRole={currentRole}
          onChangeRole={handleSwitchRole}
          requests={requests}
        />

        {/* Bottom Home Indicator */}
        <div className="h-1.5 w-32 bg-black/15 rounded-full mx-auto my-1.5 shrink-0 z-20" />
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
