import React, { useState } from 'react';
import { SystemUser, ActivityRequest, UserRole, AuditLogEntry } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { EditUserModal } from './EditUserModal';
import { PasswordResetModal } from './PasswordResetModal';
import { ExportReportModal } from './ExportReportModal';
import { AuditTrailCard } from './AuditTrailCard';
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
  UserPen,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  MapPin,
  Mail,
} from 'lucide-react';

interface Props {
  users: SystemUser[];
  requests: ActivityRequest[];
  auditLogs: AuditLogEntry[];
  onAddUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (updatedUser: SystemUser) => void;
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
  auditLogs,
  onAddUser,
  onUpdateUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onResetUserPassword,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'metrics'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<SystemUser | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmpNum, setNewEmpNum] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState('قسم تقنية المعلومات');
  const [newBranch, setNewBranch] = useState('فرع الزلفي - شطر الطلاب');
  const [newRole, setNewRole] = useState<Exclude<UserRole, 'login'>>('emp');
  const [newPassword, setNewPassword] = useState('123');
  const [addError, setAddError] = useState<string | null>(null);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.branch && u.branch.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
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
      email: newEmail.trim() || `${cleanNum}@mu.edu.sa`,
      role: newRole,
      department: newDepartment.trim() || 'الكلية التطبيقية',
      branch: newBranch,
      password: newPassword.trim() || '123',
      isActive: true,
    });

    // Reset Form
    setNewName('');
    setNewEmpNum('');
    setNewEmail('');
    setNewPassword('123');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif] text-right">
      {/* Admin Title Card */}
      <div className="bg-gradient-to-l from-[#1b4332] via-[#143728] to-[#081c15] text-white rounded-3xl p-4 sm:p-5 shadow-lg flex items-center justify-between border border-[#1b4332] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#c59b27]" />
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c59b27] to-[#e6c566] text-[#081c15] flex items-center justify-center font-bold shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c59b27]/20 text-[#e6c566] border border-[#c59b27]/40">
                الإدارة المركزية
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#e6c566] leading-none">
                لوحة تحكم مدير النظام العام (System Admin)
              </h2>
            </div>
            <p className="text-[11px] text-white/80 mt-1">
              إدارة الكوادر، الصلاحيات، متابعة سير العمل، وحوكمة منصة ارتقاء
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-[#c59b27] to-[#e6c566] hover:from-[#d8ab2e] hover:to-[#f3d37a] text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span className="hidden sm:inline">إنشاء حساب جديد</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>

      {/* Sub Tabs: User Management vs Workflow Metrics */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200 shadow-inner text-xs font-bold gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeTab === 'users'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4 text-[#c59b27]" />
          <span>إدارة المستخدمين والصلاحيات ({users.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeTab === 'metrics'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md shadow-[#1b4332]/25'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Activity className="w-4 h-4 text-[#c59b27]" />
          <span>متابعة سير العمل العام ({totalRequests})</span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الرقم الوظيفي، البريد، الفرع، أو القسم..."
                className="w-full pl-4 pr-10 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* Filter by role pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('emp')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'emp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                الموظفون
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('manager')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'manager'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                المدراء
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('auditor')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'auditor'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                المدققون
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('uploader')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedRoleFilter === 'uploader'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                مسؤولو ارتقاء
              </button>
            </div>
          </div>

          {/* User Cards List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 text-slate-400 text-xs shadow-sm">
                لا يوجد مستخدمون مطابقون لمعايير البحث الحالية
              </div>
            ) : (
              filteredUsers.map((u) => {
                const roleConfig = ROLE_LABELS[u.role];
                return (
                  <div
                    key={u.id}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
                      u.isActive
                        ? 'border-slate-200 hover:border-slate-300'
                        : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    {/* Top User Info */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${
                            u.role === 'admin'
                              ? 'bg-[#1b4332] text-[#e6c566]'
                              : 'bg-slate-100 text-[#1b4332]'
                          }`}
                        >
                          {u.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                              {u.name}
                            </h3>
                            {!u.isActive && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                                معطل حالياً
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                              #{u.employeeNumber}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>{u.department}</span>
                            </span>
                            {u.branch && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <MapPin className="w-3 h-3 text-[#c59b27]" />
                                  <span>{u.branch}</span>
                                </span>
                              </>
                            )}
                            {u.email && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-400 text-[10px]">
                                  {u.email}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Current Role Badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${roleConfig.bg} ${roleConfig.text}`}
                      >
                        {roleConfig.label}
                      </span>
                    </div>

                    {/* Controls Bar: Role Selector, Edit Modal Trigger, Password Reset, Status Toggle */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                      {/* Role Selector */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          الصلاحية:
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) =>
                            onUpdateUserRole(u.id, e.target.value as Exclude<UserRole, 'login'>)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                        >
                          <option value="emp">موظف (مقدم الطلب)</option>
                          <option value="manager">المدير المباشر</option>
                          <option value="auditor">مسؤول التدقيق والاعتماد</option>
                          <option value="uploader">مسؤول الرفع لمنصة ارتقاء</option>
                          <option value="admin">مدير النظام (Admin)</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. زر تعديل البيانات */}
                        <button
                          type="button"
                          onClick={() => setEditingUser(u)}
                          title="تعديل بيانات المستخدم (الاسم، الرقم، البريد، القسم، الفرع)"
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#1b4332] hover:text-[#e6c566] hover:border-[#1b4332] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                        >
                          <UserPen className="w-3.5 h-3.5 text-[#c59b27]" />
                          <span>تعديل</span>
                        </button>

                        {/* 2. مؤشر حالة الحساب وزر التحويل السريع (نشط / معطل) بلون واضح */}
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(u.id)}
                          title={u.isActive ? 'انقر للتحويل السريع إلى (معطل)' : 'انقر للتحويل السريع إلى (نشط)'}
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 ring-1 ring-emerald-400/20'
                              : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 ring-1 ring-rose-400/20'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>نشط</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>معطل</span>
                            </>
                          )}
                        </button>

                        {/* 3. زر كلمة المرور (توليد كلمة مؤقتة وإظهار خيار نسخها) */}
                        <button
                          type="button"
                          onClick={() => setResetPasswordUser(u)}
                          title="إعادة تعيين كلمة المرور وتوليد كلمة مؤقتة"
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                          <span>كلمة المرور</span>
                        </button>

                        {/* Delete User (Non-admin only) */}
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من رغبتك في حذف حساب "${u.name}" نهائياً من سجلات النظام؟`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            title="حذف المستخدم"
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer active:scale-95"
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
          {/* Header Action Bar: Export Final Report */}
          <div className="bg-gradient-to-r from-slate-900 via-[#1b4332] to-slate-900 text-white p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#c59b27]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c59b27]/20 text-[#e6c566] border border-[#c59b27]/40">
                  الحوكمة والأرشفة
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#e6c566]">
                  متابعة وتقارير سير العمل العام
                </h3>
              </div>
              <p className="text-[11px] text-white/80 mt-1">
                استعراض مسار التدقيق ومعدل رفع ساعات الأنشطة في السجل المهاري لمنصة ارتقاء
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="bg-gradient-to-r from-[#c59b27] to-[#e6c566] hover:from-[#d8ab2e] hover:to-[#f3d37a] text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>تصدير التقرير النهائي (Excel / PDF)</span>
            </button>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1b4332]">
                معدل إنجاز وتوثيق الأنشطة في منصة ارتقاء
              </span>
              <span className="text-xs font-extrabold text-[#c59b27]">
                {completionRate}% تم التوثيق بنجاح
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-gradient-to-r from-[#1b4332] to-[#c59b27] h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                بانتظار المدير المباشر
              </span>
              <span className="text-lg font-black text-amber-700">{pendingManager}</span>
              <span className="text-[10px] text-slate-500 block">طلبات جديدة</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                بانتظار تدقيق الكلية
              </span>
              <span className="text-lg font-black text-purple-700">{pendingAuditor}</span>
              <span className="text-[10px] text-slate-500 block">معتمدة أولياً</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                معتمدة وجاهزة للرفع
              </span>
              <span className="text-lg font-black text-emerald-700">{approvedCount}</span>
              <span className="text-[10px] text-slate-500 block">مكتملة الضوابط</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                رُفعت لمنصة ارتقاء
              </span>
              <span className="text-lg font-black text-[#1b4332]">{uploadedCount}</span>
              <span className="text-[10px] text-slate-500 block">موثقة نهائياً</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                طلبات مسترجعة
              </span>
              <span className="text-lg font-black text-rose-700">{returnedCount}</span>
              <span className="text-[10px] text-slate-500 block">تحتاج استيفاء</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                إجمالي الكوادر المسجلة
              </span>
              <span className="text-lg font-black text-slate-800">{users.length}</span>
              <span className="text-[10px] text-slate-500 block">
                {users.filter((u) => u.isActive).length} حساب نشط
              </span>
            </div>
          </div>

          {/* All Requests Activity Feed */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-[#1b4332] mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#c59b27]" />
              <span>متابعة حالة كافة أنشطة النظام الحالية</span>
            </h3>

            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-amber-50/40 hover:border-[#c59b27]/40 flex items-center justify-between gap-2 transition cursor-pointer"
                >
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{req.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({req.type})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
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

      {/* Mini Audit Trail: Persistent across view displaying latest 5 actions */}
      <div className="pt-2">
        <AuditTrailCard logs={auditLogs} />
      </div>

      {/* MODAL 1: ADD NEW USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-100 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#1b4332]">إنشاء حساب مستخدم جديد</h3>
                  <p className="text-[10px] text-slate-400">إضافة عضو وتعيين الصلاحيات الأولية</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: د. محمد بن عبد الله الشمري"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الوظيفي *</label>
                  <input
                    type="text"
                    value={newEmpNum}
                    onChange={(e) => setNewEmpNum(e.target.value)}
                    placeholder="4412099"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني الجامعي</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="emp@mu.edu.sa"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الصلاحية والدور في النظام *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Exclude<UserRole, 'login'>)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition font-bold"
                >
                  <option value="emp">1. موظف (مقدم الطلب - رفع الأنشطة ومتابعتها)</option>
                  <option value="manager">2. المدير المباشر (المراجعة الأولية والاعتماد)</option>
                  <option value="auditor">3. مسؤول التدقيق والاعتماد (مراجعة الضوابط وعميد الكلية)</option>
                  <option value="uploader">4. مسؤول الرفع لمنصة ارتقاء (التوثيق النهائي)</option>
                  <option value="admin">5. مدير النظام (لوحة التحكم الشاملة)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الوحدة الإدارية *</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="قسم تقنية المعلومات"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الفرع *</label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none transition"
                  >
                    <option value="فرع الزلفي - شطر الطلاب">فرع الزلفي - شطر الطلاب</option>
                    <option value="فرع الزلفي - شطر الطالبات">فرع الزلفي - شطر الطالبات</option>
                    <option value="فرع المجمعة - شطر الطلاب">فرع المجمعة - شطر الطلاب</option>
                    <option value="فرع المجمعة - شطر الطالبات">فرع المجمعة - شطر الطالبات</option>
                    <option value="فرع رماح">فرع رماح</option>
                    <option value="المقر الرئيسي - إدارة الكلية">المقر الرئيسي - إدارة الكلية</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد إنشاء الحساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER PROFILE */}
      <EditUserModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={onUpdateUser}
        existingUsers={users}
      />

      {/* MODAL 3: RESET PASSWORD WITH AUTO-GENERATED TEMP PASSWORD & COPY OPTION */}
      <PasswordResetModal
        user={resetPasswordUser}
        isOpen={Boolean(resetPasswordUser)}
        onClose={() => setResetPasswordUser(null)}
        onConfirm={onResetUserPassword}
      />

      {/* MODAL 4: EXPORT FINAL REPORT (EXCEL / PDF) */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        requests={requests}
      />

      {/* MODAL 5: REQUEST FULL DETAILS */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
