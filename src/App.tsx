import { useState, useEffect } from 'react';
import { Download, Rocket, Smartphone, Monitor, RotateCcw } from 'lucide-react';
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
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
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

  // Active step calculation for workflow panel
  const isStep1Active = currentRole === 'emp';
  const isStep2Active = currentRole === 'manager' || currentRole === 'auditor';
  const isStep3Active = currentRole === 'uploader';

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f0f4f2] flex flex-col items-center justify-start lg:justify-center p-2 sm:p-4 lg:p-6 text-slate-800 antialiased font-['Tajawal',sans-serif]"
    >
      {/* Quick Utilities (Discreet top-left pill without any role simulation) */}
      <div className="fixed top-3 left-3 z-40 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-gray-200/80 select-none">
        <button
          type="button"
          onClick={() => setIsAndroidModalOpen(true)}
          title="تثبيت التطبيق على الجوال"
          className="px-2 py-1 text-[#1b4332] hover:bg-emerald-50 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5 text-[#c59b27]" />
          <span className="hidden sm:inline text-[11px]">تثبيت الجوال</span>
        </button>
        <div className="w-px h-4 bg-gray-200 my-auto" />
        <button
          type="button"
          onClick={() => setIsStoreModalOpen(true)}
          title="تجهيز النشر على المتاجر"
          className="px-2 py-1 text-gray-700 hover:text-[#1b4332] hover:bg-emerald-50 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <Rocket className="w-3.5 h-3.5 text-[#c59b27]" />
          <span className="hidden sm:inline text-[11px]">المتاجر</span>
        </button>
        <div className="w-px h-4 bg-gray-200 my-auto" />
        <button
          type="button"
          onClick={() => setIsPhoneFrame((prev) => !prev)}
          title={isPhoneFrame ? 'التبديل إلى العرض الموسع' : 'التبديل إلى إطار هاتف'}
          className="px-2 py-1 text-gray-700 hover:text-[#1b4332] hover:bg-gray-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline text-[11px]">موسع</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline text-[11px]">هاتف</span>
            </>
          )}
        </button>
        <div className="w-px h-4 bg-gray-200 my-auto" />
        <button
          type="button"
          onClick={handleResetData}
          title="استعادة البيانات الافتراضية"
          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-12 w-full max-w-6xl my-auto">
        {/* Left Panel: Context & Description (Visible on wide screens, matching Sleek Interface theme) */}
        {isPhoneFrame && (
          <aside className="hidden lg:flex w-[380px] xl:w-[440px] flex-col justify-center shrink-0 text-right select-none">
            <div className="mb-8">
              <div className="w-16 h-16 bg-[#1b4332] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#1b4332]/25 border border-[#1b4332]">
                <div className="w-8 h-8 border-4 border-[#c59b27] rounded-full"></div>
              </div>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-[#1b4332] leading-tight mb-3">
                نظام اعتماد<br />الأنشطة والدورات
              </h1>
              <p className="text-gray-600 text-sm xl:text-base leading-relaxed">
                حل متكامل لإدارة المسيرة التدريبية والطلابية في الكلية التطبيقية، يربط بين الموظفين، الإدارة، والرفع لمنصة ارتقاء الرسمية.
              </p>
            </div>

            {/* Workflow Process Cards */}
            <div className="space-y-4">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => handleSwitchRole('emp')}
                className={`w-full text-right flex items-center gap-4 p-4 rounded-2xl transition cursor-pointer ${
                  isStep1Active
                    ? 'bg-white border border-gray-200 shadow-sm ring-2 ring-[#1b4332]/10'
                    : 'bg-white/50 border border-dashed border-gray-300 hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    isStep1Active
                      ? 'bg-green-100 text-[#1b4332]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  1
                </div>
                <div>
                  <div
                    className={`font-bold text-sm ${
                      isStep1Active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    تقديم الطلب
                  </div>
                  <div
                    className={`text-xs ${
                      isStep1Active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    رفع بيانات النشاط وكشوفات الحضور (الموظف)
                  </div>
                </div>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => handleSwitchRole('manager')}
                className={`w-full text-right flex items-center gap-4 p-4 rounded-2xl transition cursor-pointer ${
                  isStep2Active
                    ? 'bg-white border border-gray-200 shadow-sm ring-2 ring-[#1b4332]/10'
                    : 'bg-white/50 border border-dashed border-gray-300 hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    isStep2Active
                      ? 'bg-green-100 text-[#1b4332]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  2
                </div>
                <div>
                  <div
                    className={`font-bold text-sm ${
                      isStep2Active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    الاعتماد والتدقيق
                  </div>
                  <div
                    className={`text-xs ${
                      isStep2Active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    مراجعة المدير المباشر ومصادقة رئيس الكلية
                  </div>
                </div>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => handleSwitchRole('uploader')}
                className={`w-full text-right flex items-center gap-4 p-4 rounded-2xl transition cursor-pointer ${
                  isStep3Active
                    ? 'bg-white border border-gray-200 shadow-sm ring-2 ring-[#1b4332]/10'
                    : 'bg-white/50 border border-dashed border-gray-300 hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    isStep3Active
                      ? 'bg-green-100 text-[#1b4332]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  3
                </div>
                <div>
                  <div
                    className={`font-bold text-sm ${
                      isStep3Active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    الرفع لارتقاء
                  </div>
                  <div
                    className={`text-xs ${
                      isStep3Active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    التوثيق النهائي على المنصة الرسمية للجامعة
                  </div>
                </div>
              </button>

              {/* Android Direct Install Card */}
              <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-[#1b4332]/15 shadow-sm mt-4 text-right">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>جاهز للتثبيت على هاتفك</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    WebAPK / أندرويد
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  امسح الباركود أو انسخ الرابط المباشر لتثبيت التطبيق على جوالك والعمل به مباشرة.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAndroidModalOpen(true)}
                  className="w-full py-2 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت الآن على الأندرويد (رمز QR)</span>
                </button>
              </div>

              {/* Utility Quick Buttons in Sidebar */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsStoreModalOpen(true)}
                  className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] border border-emerald-200 font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Rocket className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>تجهيز المتاجر</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhoneFrame((prev) => !prev)}
                  className="text-xs bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-xl border border-gray-200 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  {isPhoneFrame ? <Monitor className="w-3.5 h-3.5 text-[#c59b27]" /> : <Smartphone className="w-3.5 h-3.5 text-[#c59b27]" />}
                  <span>{isPhoneFrame ? 'موسع' : 'هاتف'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  title="استعادة البيانات الافتراضية"
                  className="text-xs bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-700 font-medium py-2 px-2.5 rounded-xl border border-gray-200 flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Mockup Container / App Frame */}
        <div className="flex-1 flex items-center justify-center bg-white/30 backdrop-blur-xs rounded-[52px] p-1 sm:p-2">
          <div
            className={`w-full bg-[#f8fafc] relative flex flex-col transition-all duration-300 ${
              isPhoneFrame
                ? 'w-[360px] sm:w-[380px] h-[750px] max-h-[92vh] rounded-[48px] border-[10px] border-[#1e1e1e] shadow-2xl overflow-hidden'
                : 'max-w-3xl h-[820px] max-h-[92vh] rounded-3xl shadow-2xl border-4 border-[#1b4332]/20 overflow-hidden'
            }`}
          >
            {/* Top Status Bar & Notch (in phone mode) */}
            {isPhoneFrame && (
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
            )}

            {/* In-app Toast */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Header (Hidden in Login View) */}
            {currentRole !== 'login' && currentProfile && (
              <AppHeader
                profile={currentProfile}
                onLogout={handleLogout}
                requests={requests}
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
            {isPhoneFrame && (
              <div className="h-1.5 w-32 bg-black/15 rounded-full mx-auto my-1.5 shrink-0 z-20" />
            )}
          </div>
        </div>
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
