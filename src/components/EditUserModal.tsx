import React, { useState, useEffect } from 'react';
import { SystemUser } from '../types';
import { User, Hash, Mail, Building, MapPin, Check, X, AlertCircle } from 'lucide-react';

interface Props {
  user: SystemUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: SystemUser) => void;
  existingUsers: SystemUser[];
}

const COMMON_BRANCHES = [
  'فرع الزلفي - شطر الطلاب',
  'فرع الزلفي - شطر الطالبات',
  'فرع المجمعة - شطر الطلاب',
  'فرع المجمعة - شطر الطالبات',
  'فرع رماح',
  'المقر الرئيسي - إدارة الكلية',
];

const COMMON_DEPARTMENTS = [
  'قسم تقنية المعلومات',
  'إدارة البرامج والتدريب',
  'وحدة التدقيق والاعتماد الأكاديمي',
  'وحدة التوثيق ومنصة ارتقاء',
  'وحدة شؤون الطلاب',
  'وحدة التطوير والجودة',
  'وحدة التدريب الميداني والشراكات',
  'إدارة النظام والتحكم العام',
];

export const EditUserModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onSave,
  existingUsers,
}) => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmployeeNumber(user.employeeNumber || '');
      setEmail(user.email || `${user.employeeNumber}@mu.edu.sa`);
      setDepartment(user.department || 'قسم تقنية المعلومات');
      setBranch(user.branch || 'فرع الزلفي - شطر الطلاب');
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmpNum = employeeNumber.trim();
    const trimmedEmail = email.trim();
    const trimmedDept = department.trim();
    const trimmedBranch = branch.trim();

    if (!trimmedName || !trimmedEmpNum || !trimmedDept) {
      setError('يرجى استيفاء كافة الحقول الأساسية المطلوبة.');
      return;
    }

    // Check employee number duplication with other users
    const isDuplicate = existingUsers.some(
      (u) => u.id !== user.id && u.employeeNumber.toLowerCase() === trimmedEmpNum.toLowerCase()
    );
    if (isDuplicate) {
      setError('الرقم الوظيفي مسجل مسبقاً لمستخدم آخر.');
      return;
    }

    const updatedUser: SystemUser = {
      ...user,
      name: trimmedName,
      employeeNumber: trimmedEmpNum,
      email: trimmedEmail,
      department: trimmedDept,
      branch: trimmedBranch,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Tajawal',sans-serif]">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-slate-100 text-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center font-bold shadow-md shadow-[#1b4332]/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1b4332]">
                تعديل بيانات المستخدم
              </h3>
              <p className="text-[11px] text-slate-500">
                تحديث السجل الوظيفي والبيانات التنظيمية للمستخدم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. الاسم الثلاثي */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>الاسم الثلاثي أو الكامل *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عبدالرحمن الطوالة أو ناصر العصيمي"
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-medium"
            />
          </div>

          {/* 2. الرقم الوظيفي والإيميل */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>الرقم الوظيفي *</span>
              </label>
              <input
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                placeholder="مثال: 4412098"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>البريد الإلكتروني الجامعي</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mu.edu.sa"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* 3. الوحدة التنظيمية / القسم */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>الوحدة التنظيمية / القسم الإداري *</span>
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="مثال: قسم تقنية المعلومات"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-medium"
              />
              <div className="flex flex-wrap gap-1">
                {COMMON_DEPARTMENTS.slice(0, 4).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepartment(d)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. الفرع */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>الفرع *</span>
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 outline-none transition font-medium"
            >
              {COMMON_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#1b4332] to-[#143728] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#1b4332]/25 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-[#e6c566]" />
              <span>حفظ التعديلات</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
