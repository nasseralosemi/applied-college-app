import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import {
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Send,
  History,
  Building2,
  Users,
  FileCheck2,
  Globe,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';

const ACTIVITY_TYPES = [
  'ورشة عمل',
  'زيارة',
  'معرض',
  'مجتمعي',
  'دورة',
  'ملتقى',
  'نشاط طلابي',
];

const SUPERVISING_UNITS = [
  'وحدة شؤون الطلاب',
  'وحدة الأنشطة الطلابية',
  'وحدة التدريب والشراكات',
  'وحدة التطوير والجودة',
  'وحدة التوجيه والإرشاد',
  'وحدة خدمة المجتمع والتعليم المستمر',
  'قسم تقنية المعلومات',
  'قسم إدارة الأعمال',
  'قسم العلوم المالية والمصرفية',
  'وحدة الابتكار وريادة الأعمال',
];

const COLLEGE_BRANCHES = [
  'فرع الزلفي - شطر الطلاب',
  'فرع الزلفي - شطر الطالبات',
  'فرع المجمعة - شطر الطلاب',
  'فرع المجمعة - شطر الطالبات',
  'فرع رماح - شطر الطلاب',
  'فرع رماح - شطر الطالبات',
  'فرع الغاط - شطر الطلاب',
  'فرع الغاط - شطر الطالبات',
  'فرع حوطة سدير',
];

const TARGET_AUDIENCES = [
  'الطلاب',
  'الطالبات',
  'الطلاب والطالبات',
  'الموظفون (الكادر الإداري)',
  'أعضاء هيئة التدريس',
  'المجتمع المحلي وكافة المهتمين',
];

const GENDER_OPTIONS = [
  'الجنسين (ذكر وأنثى)',
  'ذكر (شطر الطلاب)',
  'أنثى (شطر الطالبات)',
];

interface Props {
  requests: ActivityRequest[];
  onSubmitRequest: (newReq: Omit<ActivityRequest, 'id' | 'status' | 'note'>) => void;
  onResubmitRequest?: (id: number) => void;
  currentUserEmpNumber?: string;
}

export const EmployeeView: React.FC<Props> = ({
  requests,
  onSubmitRequest,
  onResubmitRequest,
  currentUserEmpNumber,
}) => {
  // Modal State for viewing details
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);

  // Group 1: Basic Info & Activity Type
  const [type, setType] = useState<string>('ورشة عمل');
  const [name, setName] = useState<string>('');
  const [presenter, setPresenter] = useState<string>('');
  const [unit, setUnit] = useState<string>('وحدة شؤون الطلاب');
  const [branch, setBranch] = useState<string>('فرع الزلفي - شطر الطلاب');

  // Group 2: Schedule & Timing
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>('10:00 ص');
  const [hours, setHours] = useState<string>('2');

  // Group 3: Audience & Execution
  const [targetAudience, setTargetAudience] = useState<string>('الطلاب');
  const [targetGender, setTargetGender] = useState<string>('الجنسين (ذكر وأنثى)');
  const [deliveryMode, setDeliveryMode] = useState<'عن بعد' | 'حضوري'>('عن بعد');
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [physicalLocation, setPhysicalLocation] = useState<string>('');

  // Group 4: Approvals & Administrative Relations
  const [partnershipApproval, setPartnershipApproval] = useState<'لا تحتاج إلى موافقة' | 'تتطلب موافقة'>('لا تحتاج إلى موافقة');
  const [transactionNumber, setTransactionNumber] = useState<string>('');
  const [coordinatorName, setCoordinatorName] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  // Validation Error State
  const [formError, setFormError] = useState<string>('');

  // Filter requests to show this employee's submitted requests
  const myRequests = currentUserEmpNumber
    ? requests.filter(
        (r) => r.submittedByEmpNumber === currentUserEmpNumber || !r.submittedByEmpNumber
      )
    : requests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Strict validation of mandatory fields
    if (!name.trim()) {
      setFormError('يرجى كتابة اسم النشاط بشكل صحيح.');
      return;
    }
    if (!presenter.trim()) {
      setFormError('يرجى تحديد مقدم النشاط (الاسم أو الجهة المنفذة).');
      return;
    }
    if (!startDate || !endDate) {
      setFormError('يرجى تحديد تاريخ بداية ونهاية النشاط.');
      return;
    }
    if (!startTime.trim()) {
      setFormError('يرجى تحديد وقت بداية النشاط.');
      return;
    }
    if (!hours || Number(hours) <= 0) {
      setFormError('يرجى إدخال عدد ساعات تدريبية صحيح أكبر من صفر.');
      return;
    }
    if (deliveryMode === 'عن بعد' && !meetingUrl.trim()) {
      setFormError('يرجى إدخال رابط النشاط الافتراضي (مثل رابط البلاك بورد أو تيمز).');
      return;
    }
    if (deliveryMode === 'حضوري' && !physicalLocation.trim()) {
      setFormError('يرجى تحديد موقع النشاط الحضوري (القاعة أو المقر).');
      return;
    }
    if (partnershipApproval === 'تتطلب موافقة' && !transactionNumber.trim()) {
      setFormError('نظراً لأن النشاط يتطلب موافقة مركز التعاون والشراكات، يرجى تدوين رقم المعاملة.');
      return;
    }
    if (!coordinatorName.trim()) {
      setFormError('يرجى تحديد اسم منسق النشاط بالكلية.');
      return;
    }
    if (!summary.trim()) {
      setFormError('يرجى كتابة ملخص النشاط والأهداف والمخرجات المرجوة.');
      return;
    }

    // Submit complete formal request
    onSubmitRequest({
      name: name.trim(),
      type,
      presenter: presenter.trim(),
      unit,
      branch,
      startDate,
      endDate,
      startTime: startTime.trim(),
      hours: Number(hours),
      targetAudience,
      targetGender,
      deliveryMode,
      meetingUrl: deliveryMode === 'عن بعد' ? meetingUrl.trim() : undefined,
      physicalLocation: deliveryMode === 'حضوري' ? physicalLocation.trim() : undefined,
      partnershipApproval,
      transactionNumber: transactionNumber.trim() || undefined,
      coordinatorName: coordinatorName.trim(),
      summary: summary.trim(),
      date: startDate,
      location: deliveryMode === 'عن بعد' ? `عن بعد - ${meetingUrl.trim()}` : physicalLocation.trim(),
    });

    // Reset Form
    setName('');
    setPresenter('');
    setMeetingUrl('');
    setPhysicalLocation('');
    setTransactionNumber('');
    setCoordinatorName('');
    setSummary('');
    setFormError('');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Form Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332]">
              <PlusCircle className="w-4 h-4 text-[#c59b27]" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1b4332] leading-tight">
                استمارة رفع النشاط الرسمية
              </h2>
              <p className="text-[10px] text-slate-500">
                منصة ارتقاء • الكلية التطبيقية
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            الحقول المعتمدة
          </span>
        </div>

        {/* Validation Alert */}
        {formError && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-2 animate-shake">
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* GROUP 1: Basic Info & Activity Type */}
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40 space-y-2.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
              <div className="w-5 h-5 rounded-md bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>البيانات الأساسية ونوع النشاط</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Activity Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نوع النشاط <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Activity Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اسم النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: وثق إنجازك في السجل المهاري"
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
                />
              </div>
            </div>

            {/* Presenter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                مقدم النشاط / المدرب / الجهة المنفذة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={presenter}
                onChange={(e) => setPresenter(e.target.value)}
                placeholder="مثال: د. عبد العزيز بن سعد المحمود أو وحدة شؤون الطلاب"
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
              />
            </div>

            {/* Unit & Branch Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  الوحدة المشرفة <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    {SUPERVISING_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  الفرع <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    {COLLEGE_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 2: Timing & Schedule */}
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40 space-y-2.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
              <div className="w-5 h-5 rounded-md bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>التوقيت والمواعيد والساعات</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تاريخ بداية النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تاريخ نهاية النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  وقت بداية النشاط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="مثال: 10:00 ص أو 01:30 م"
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  عدد الساعات التدريبية المعتمدة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="60"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* GROUP 3: Target Audience & Delivery Mode */}
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40 space-y-2.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
              <div className="w-5 h-5 rounded-md bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>المستهدفون وحالة التنفيذ</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  الفئة المستهدفة <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    {TARGET_AUDIENCES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  النوع / الجنس <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={targetGender}
                    onChange={(e) => setTargetGender(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Delivery Mode Toggle */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                حالة النشاط (طريقة التنفيذ) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('عن بعد')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    deliveryMode === 'عن بعد'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>عن بعد (Virtual)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('حضوري')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    deliveryMode === 'حضوري'
                      ? 'bg-amber-50 border-[#c59b27] text-amber-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>حضوري (On-Campus)</span>
                </button>
              </div>
            </div>

            {/* Conditional Input based on Delivery Mode */}
            {deliveryMode === 'عن بعد' ? (
              <div className="animate-in fade-in duration-150">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  رابط النشاط الافتراضي (URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://blackboard.mu.edu.sa/... أو رابط Microsoft Teams"
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium ltr text-left"
                />
              </div>
            ) : (
              <div className="animate-in fade-in duration-150">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  موقع النشاط (القاعة أو المقر) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={physicalLocation}
                  onChange={(e) => setPhysicalLocation(e.target.value)}
                  placeholder="مثال: مدرج الكلية التطبيقية الرئيسي أو قاعة التدريب 104"
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
                />
              </div>
            )}
          </div>

          {/* GROUP 4: Administrative Approvals & Coordinator */}
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40 space-y-2.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
              <div className="w-5 h-5 rounded-md bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                4
              </div>
              <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>الموافقات والارتباطات الإدارية</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Partnership Approval */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  مركز التعاون والشراكات <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={partnershipApproval}
                    onChange={(e) =>
                      setPartnershipApproval(
                        e.target.value as 'لا تحتاج إلى موافقة' | 'تتطلب موافقة'
                      )
                    }
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer"
                  >
                    <option value="لا تحتاج إلى موافقة">لا تحتاج إلى موافقة</option>
                    <option value="تتطلب موافقة">تتطلب موافقة مركز التعاون والشراكات</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Transaction Number (Optional or Required if partnership requires approval) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  رقم المعاملة (الاتصالات الإدارية)
                  {partnershipApproval === 'تتطلب موافقة' ? (
                    <span className="text-rose-500"> *</span>
                  ) : (
                    <span className="text-slate-400 font-normal"> (اختياري)</span>
                  )}
                </label>
                <input
                  type="text"
                  required={partnershipApproval === 'تتطلب موافقة'}
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  placeholder={
                    partnershipApproval === 'تتطلب موافقة'
                      ? 'مطلوب: مثال 44-0982-م'
                      : 'أدخل رقم المعاملة عند توفرها'
                  }
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
                />
              </div>
            </div>

            {/* Coordinator Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                منسق النشاط <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                placeholder="اسم عضو هيئة التدريس أو الموظف المنسق للنشاط"
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium"
              />
            </div>

            {/* Summary & Objectives */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ملخص النشاط والأهداف والمخرجات <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="اكتب وصفاً مفصلاً للنشاط والأهداف التعليمية والمهارية المستهدفة..."
                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/20 transition cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#e6c566]" />
            <span>إرسال استمارة النشاط للمدير المباشر للاعتماد</span>
          </button>
        </form>
      </div>

      {/* Tracking Card - Employee's Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#c59b27]" />
            <span>طلباتي ومتابعة سير المعاملات ({myRequests.length})</span>
          </h2>
          <span className="text-[11px] text-[#c59b27] font-bold">تحديث فوري</span>
        </div>

        {myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500">لم تقم برفع أي طلبات حتى الآن.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((r) => {
              const borderAccentColor =
                r.status === 'uploaded_irtqaa'
                  ? 'border-r-[#1b4332]'
                  : r.status === 'approved_final' || r.status === 'pending_auditor'
                  ? 'border-r-emerald-500'
                  : r.status === 'returned_emp' || r.status === 'returned_manager'
                  ? 'border-r-rose-500'
                  : 'border-r-[#c59b27]';

              return (
                <div
                  key={r.id}
                  className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-r-4 ${borderAccentColor} hover:shadow-md transition`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{r.name}</span>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {r.type}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {r.presenter} • <span className="text-slate-700 font-medium">{r.branch || 'فرع الكلية'}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <StatusBadge status={r.status} note={r.note} />
                    </div>
                  </div>

                  {/* Summary badges */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.startDate || r.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.hours} ساعات تدريبية</span>
                    </span>
                    <span className="flex items-center gap-1">
                      {r.deliveryMode === 'عن بعد' ? (
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                      )}
                      <span>{r.deliveryMode === 'عن بعد' ? 'عن بعد' : (r.physicalLocation || r.location || 'حضوري')}</span>
                    </span>
                    {r.transactionNumber && (
                      <span className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                        معاملة: {r.transactionNumber}
                      </span>
                    )}
                  </div>

                  {r.summary && (
                    <div className="bg-slate-50/80 p-2 rounded-lg text-[11px] text-slate-600 line-clamp-2 italic mb-2.5">
                      {r.summary}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(r)}
                      className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>عرض تفاصيل الاستمارة الكاملة</span>
                    </button>

                    {r.status === 'returned_emp' && onResubmitRequest && (
                      <button
                        type="button"
                        onClick={() => onResubmitRequest(r.id)}
                        className="text-[11px] bg-[#c59b27] hover:bg-[#b0881e] text-[#081c15] font-bold px-3 py-1 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        إعادة الرفع للمدير
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
