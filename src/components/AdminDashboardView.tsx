import React, { useState } from 'react';
import { SystemUser, ActivityRequest, UserRole } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  KeyRound,
  Trash2,
  Activity,
  Search,
  Building,
  Check,
  Clock,
  Layers,
  Sparkles,
  Lock,
  User,
  AlertTriangle
} from 'lucide-react';

interface Props {
  users: SystemUser[];
  requests: ActivityRequest[];
  onAddUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onUpdateUserRole: (userId: string, newRole: Exclude<UserRole, 'login'>) => void;
  onToggleUserStatus: (userId: string) => void;
  onResetUserPassword: (userId: string, newPass: string) => void;
  onDeleteUser: (userId: string) => void;
}

const ROLE_LABELS: Record<Exclude<UserRole, 'login'>, { label: string; bg: string; text: string }> = {
  emp: { label: 'موظف (مقدم الطلب)', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  manager: { label: 'المدير المباشر', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
  auditor: { label: 'مسؤول التدقيق والاعتماد', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800' },
  uploader: { label: 'مسؤول الرفع لمنصة ارتقاء', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
  admin: { label: 'مدير النظام (Admin)', bg: 'bg-slate-900 border-slate-700', text: 'text-[#e6c566]' },
};

export const AdminDashboardView: React.FC<Props> = ({
  users,
  requests,
  onAddUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onResetUserPassword,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'metrics'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('123');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmpNum, setNewEmpNum] = useState('');
  const [newDepartment, setNewDepartment] = useState('قسم تقنية المعلومات');
  const [newRole, setNewRole] = useState<Exclude<UserRole, 'login'>>('emp');
  const [newPassword, setNewPassword] = useState('123');
  const [addError, setAddError] = useState<string | null>(null);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate Metrics
  const totalRequests = requests.length;
  const pendingManager = requests.filter((r) => r.status === 'pending_manager').length;
  const pendingAuditor = requests.filter((r) => r.status === 'pending_auditor').length;
  const returnedCount = requests.filter((r) => r.status === 'returned_emp' || r.status === 'returned_manager').length;
  const approvedCount = requests.filter((r) => r.status === 'approved_final').length;
  const uploadedCount = requests.filter((r) => r.status === 'uploaded_irtqaa').length;
  const completionRate = totalRequests > 0 ? Math.round((uploadedCount / totalRequests) * 100) : 0;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const cleanNum = newEmpNum.trim();
    if (!cleanNum || !newName.trim()) {
      setAddError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (users.some((u) => u.employeeNumber.toLowerCase() === cleanNum.toLowerCase())) {
      setAddError('الرقم الوظيفي مسجل مسبقاً لمستخدم آخر.');
      return;
    }

    onAddUser({
      employeeNumber: cleanNum,
      name: newName.trim(),
      role: newRole,
      department: newDepartment.trim() || 'الكلية التطبيقية',
      password: newPassword.trim() || '123',
      isActive: true,
    });

    // Reset Form
    setNewName('');
    setNewEmpNum('');
    setNewPassword('123');
    setIsAddModalOpen(false);
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetModalUserId && newPasswordVal.trim()) {
      onResetUserPassword(resetModalUserId, newPasswordVal.trim());
      setResetModalUserId(null);
      setNewPasswordVal('123');
    }
  };

  return (
    <div className="space-y-4">
      {/* Admin Title Card */}
      <div className="bg-gradient-to-l from-[#1b4332] to-[#143728] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-[#1b4332]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c59b27] text-[#081c15] flex items-center justify-center font-bold shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#e6c566] leading-none mb-1">
              لوحة تحكم مدير النظام
            </h2>
            <p className="text-[11px] text-white/80">
              إدارة الكوادر، الصلاحيات، ومتابعة اعتماد أنشطة الكلية التطبيقية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#c59b27] hover:bg-[#d8ab2e] text-[#081c15] font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">إنشاء حساب جديد</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>

      {/* Sub Tabs: User Management vs Workflow Metrics */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200/80 shadow-xs text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة المستخدمين والصلاحيات ({users.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>متابعة سير العمل العام ({totalRequests})</span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الرقم الوظيفي، أو القسم..."
                className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            {/* Filter by role pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                الكل ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('emp')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'emp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                الموظفون
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('manager')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'manager'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                المدراء
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('auditor')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'auditor'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                المدققون
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('uploader')}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'uploader'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                مسؤولو ارتقاء
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="space-y-2.5">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-gray-400 text-xs">
                لا يوجد مستخدمون مطابقون لمعايير البحث
              </div>
            ) : (
              filteredUsers.map((u) => {
                const roleConfig = ROLE_LABELS[u.role];
                return (
                  <div
                    key={u.id}
                    className={`bg-white rounded-2xl p-4 border transition shadow-xs ${
                      u.isActive ? 'border-gray-200' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    {/* Top User Info */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            u.role === 'admin'
                              ? 'bg-[#1b4332] text-[#e6c566]'
                              : 'bg-gray-100 text-[#1b4332]'
                          }`}
                        >
                          {u.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-gray-900">{u.name}</h3>
                            {!u.isActive && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-md">
                                معطل
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-gray-700">
                              #{u.employeeNumber}
                            </span>
                            <span>•</span>
                            <span>{u.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current Role Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${roleConfig.bg} ${roleConfig.text}`}
                      >
                        {roleConfig.label}
                      </span>
                    </div>

                    {/* Role Selector & Quick Permissions */}
                    <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                        <label className="text-[10px] font-bold text-gray-500 whitespace-nowrap">
                          تعديل الصلاحية:
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) =>
                            onUpdateUserRole(u.id, e.target.value as Exclude<UserRole, 'login'>)
                          }
                          className="flex-1 px-2 py-1 rounded-lg border border-gray-200 text-[11px] font-bold bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                        >
                          <option value="emp">موظف (مقدم الطلب)</option>
                          <option value="manager">المدير المباشر</option>
                          <option value="auditor">مسؤول التدقيق والاعتماد</option>
                          <option value="uploader">مسؤول الرفع لمنصة ارتقاء</option>
                          <option value="admin">مدير النظام (Admin)</option>
                        </select>
                      </div>

                      {/* Actions: Toggle Active, Reset Password, Delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(u.id)}
                          title={u.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                            u.isActive
                              ? 'bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <XCircle className="w-3 h-3 text-rose-500" />
                              <span>تعطيل</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>تفعيل</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setResetModalUserId(u.id);
                            setNewPasswordVal('123');
                          }}
                          title="إعادة تعيين كلمة المرور"
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 flex items-center gap-1 transition cursor-pointer"
                        >
                          <KeyRound className="w-3 h-3 text-amber-600" />
                          <span>كلمة المرور</span>
                        </button>

                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من رغبتك في حذف حساب "${u.name}"؟`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            title="حذف المستخدم"
                            className="p-1 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WORKFLOW & SYSTEM METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          {/* Progress Overview */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1b4332]">
                معدل إنجاز واعتماد الأنشطة
              </span>
              <span className="text-xs font-extrabold text-[#c59b27]">
                {completionRate}% تم رفعها لارتقاء
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#1b4332] h-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                بانتظار المدير المباشر
              </span>
              <span className="text-lg font-black text-amber-700">{pendingManager}</span>
              <span className="text-[10px] text-gray-500 block">طلبات جديدة</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                بانتظار تدقيق الكلية
              </span>
              <span className="text-lg font-black text-purple-700">{pendingAuditor}</span>
              <span className="text-[10px] text-gray-500 block">معتمدة أولياً</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                معتمدة وجاهزة للرفع
              </span>
              <span className="text-lg font-black text-emerald-700">{approvedCount}</span>
              <span className="text-[10px] text-gray-500 block">مكتملة الضوابط</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                رُفعت لمنصة ارتقاء
              </span>
              <span className="text-lg font-black text-[#1b4332]">{uploadedCount}</span>
              <span className="text-[10px] text-gray-500 block">موثقة نهائياً</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                طلبات مسترجعة
              </span>
              <span className="text-lg font-black text-rose-700">{returnedCount}</span>
              <span className="text-[10px] text-gray-500 block">تحتاج استيفاء</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-right">
              <span className="text-[10px] text-gray-400 font-bold block mb-1">
                إجمالي الكوادر المسجلة
              </span>
              <span className="text-lg font-black text-slate-800">{users.length}</span>
              <span className="text-[10px] text-gray-500 block">
                {users.filter((u) => u.isActive).length} نشط
              </span>
            </div>
          </div>

          {/* All Requests Activity Feed */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <h3 className="text-xs font-bold text-[#1b4332] mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#c59b27]" />
              <span>متابعة حالة كافة أنشطة النظام الحالية</span>
            </h3>

            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-slate-100/80 hover:border-[#c59b27]/40 flex items-center justify-between gap-2 transition cursor-pointer"
                >
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span>{req.name}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({req.type})</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{req.presenter}</span>
                      <span>•</span>
                      <span>{req.branch || 'فرع الكلية'}</span>
                      <span>•</span>
                      <span>{req.hours} ساعات</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {req.status === 'pending_manager' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        المدير المباشر
                      </span>
                    )}
                    {req.status === 'pending_auditor' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        التدقيق والرئاسة
                      </span>
                    )}
                    {req.status === 'approved_final' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        جاهز للرفع
                      </span>
                    )}
                    {req.status === 'uploaded_irtqaa' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-[#e6c566] border border-slate-700">
                        منصة ارتقاء
                      </span>
                    )}
                    {req.status === 'returned_emp' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        مسترجع للموظف
                      </span>
                    )}
                    {req.status === 'returned_manager' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        مسترجع للمدير
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl border border-gray-100 text-right animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#1b4332]">إنشاء حساب مستخدم جديد</h3>
                  <p className="text-[10px] text-gray-400">إضافة عضو جديد وتحديد دوره وصلاحيته</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: د. محمد بن عبد الله الشمري"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الرقم الوظيفي</label>
                  <input
                    type="text"
                    value={newEmpNum}
                    onChange={(e) => setNewEmpNum(e.target.value)}
                    placeholder="مثال: 4412099"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">كلمة المرور</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الصلاحية والدور في النظام
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Exclude<UserRole, 'login'>)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-bold"
                >
                  <option value="emp">1. موظف (مقدم الطلب - رفع الأنشطة ومتابعتها)</option>
                  <option value="manager">2. المدير المباشر (المراجعة الأولية والاعتماد)</option>
                  <option value="auditor">3. مسؤول التدقيق والاعتماد (مراجعة الضوابط وعميد الكلية)</option>
                  <option value="uploader">4. مسؤول الرفع لمنصة ارتقاء (التوثيق النهائي)</option>
                  <option value="admin">5. مدير النظام (لوحة التحكم الشاملة)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">القسم / الوحدة الإدارية</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="مثال: قسم تقنية المعلومات"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد إنشاء الحساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetModalUserId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-gray-100 text-right animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xs font-extrabold text-[#1b4332] mb-1 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#c59b27]" />
              <span>إعادة تعيين كلمة المرور</span>
            </h3>
            <p className="text-[11px] text-gray-500 mb-3">
              أدخل كلمة المرور الجديدة للمستخدم:
            </p>

            <form onSubmit={handleConfirmPasswordReset} className="space-y-3">
              <input
                type="text"
                value={newPasswordVal}
                onChange={(e) => setNewPasswordVal(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة..."
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-mono"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                >
                  حفظ كلمة المرور
                </button>
                <button
                  type="button"
                  onClick={() => setResetModalUserId(null)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: REQUEST FULL DETAILS */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
