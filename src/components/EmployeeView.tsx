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
  FileText,
  RotateCcw,
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
  const [activeTab, setActiveTab] = useState<'form' | 'tracking'>('form');
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
        (r) =>
          r.submittedByEmpNumber === currentUserEmpNumber ||
          !r.submittedByEmpNumber
      )
    : requests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
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

    // Switch to tracking tab to see the newly submitted request
    setActiveTab('tracking');
  };

  return (
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif]">
      {/* Top Segmented Tabs: New Form vs Tracking */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'form'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>استمارة رفع نشاط جديد</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'tracking'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل طلباتي</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
              activeTab === 'tracking'
                ? 'bg-[#c59b27] text-slate-950'
                : 'bg-slate-300 text-slate-800'
            }`}
          >
            {myRequests.length}
          </span>
        </button>
      </div>

      {/* TAB 1: FORM VIEW */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/60 border border-slate-200/90 animate-fade-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] border border-[#1b4332]/20">
                <PlusCircle className="w-5 h-5 text-[#c59b27]" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#1b4332] leading-tight">
                  استمارة رفع النشاط الرسمية
                </h2>
                <p className="text-[10px] text-slate-500">
                  معتمدة للرفع المباشر إلى منصة ارتقاء • الكلية التطبيقية
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
              استمارة معتمدة
            </span>
          </div>

          {/* Validation Alert */}
          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center gap-2 animate-fade-slide-up">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* GROUP 1: Basic Info & Activity Type */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                <div className="w-5 h-5 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </div>
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>البيانات الأساسية ونوع النشاط</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Activity Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نوع النشاط <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      {ACTIVITY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    placeholder="مثال: دورة أمن المعلومات والأمن السيبراني"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* Presenter / Speaker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    مقدم النشاط (المحاضر / المدرب) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={presenter}
                    onChange={(e) => setPresenter(e.target.value)}
                    placeholder="مثال: د. محمد بن عبد الله الشمري"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* Supervising Unit */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الوحدة المشرفة <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      {SUPERVISING_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* College Branch */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الفرع والشطر <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      {COLLEGE_BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 2: Schedule & Timing */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                <div className="w-5 h-5 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </div>
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>التوقيت والمواعيد والساعات التدريبية</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Start Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    تاريخ بداية النشاط <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    تاريخ نهاية النشاط <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    وقت بداية النشاط <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="مثال: 10:00 ص أو 01:00 م"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* Training Hours */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    عدد الساعات التدريبية المعتمدة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* GROUP 3: Target Audience & Delivery Mode */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                <div className="w-5 h-5 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>المستهدفون وحالة وطريقة التنفيذ</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Target Audience */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الفئة المستهدفة <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      {TARGET_AUDIENCES.map((aud) => (
                        <option key={aud} value={aud}>
                          {aud}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Target Gender */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الجنس المستهدف <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Delivery Mode Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  حالة وطريقة التنفيذ <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('عن بعد')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                      deliveryMode === 'عن بعد'
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#e6c566]" />
                    <span>عن بعد (Online)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('حضوري')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                      deliveryMode === 'حضوري'
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>حضوري (On-Campus)</span>
                  </button>
                </div>
              </div>

              {/* Conditional Input based on Delivery Mode */}
              {deliveryMode === 'عن بعد' ? (
                <div className="animate-fade-slide-up">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    رابط النشاط الافتراضي (URL) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://blackboard.mu.edu.sa/... أو رابط Microsoft Teams"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium text-left ltr shadow-xs"
                  />
                </div>
              ) : (
                <div className="animate-fade-slide-up">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    موقع النشاط (القاعة أو المقر) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={physicalLocation}
                    onChange={(e) => setPhysicalLocation(e.target.value)}
                    placeholder="مثال: مدرج الكلية التطبيقية الرئيسي أو قاعة التدريب 104"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* GROUP 4: Administrative Approvals & Coordinator */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                <div className="w-5 h-5 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold">
                  4
                </div>
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>الموافقات والارتباطات الإدارية وملخص النشاط</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none appearance-none font-medium cursor-pointer shadow-xs"
                    >
                      <option value="لا تحتاج إلى موافقة">لا تحتاج إلى موافقة</option>
                      <option value="تتطلب موافقة">تتطلب موافقة مركز التعاون والشراكات</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Transaction Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    رقم المعاملة (الاتصالات الإدارية)
                    {partnershipApproval === 'تتطلب موافقة' ? (
                      <span className="text-rose-500"> *</span>
                    ) : (
                      <span className="text-slate-400 text-[10px] font-normal"> (اختياري)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required={partnershipApproval === 'تتطلب موافقة'}
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    placeholder="مثال: 44-0982-م"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium font-mono shadow-xs"
                  />
                </div>

                {/* Coordinator Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    اسم منسق النشاط بالكلية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    placeholder="الاسم الثلاثي لمنسق الفعالية"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none font-medium shadow-xs"
                  />
                </div>

                {/* Summary & Goals */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ملخص النشاط والأهداف المرجوة <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="اكتب نبذة مختصرة عن أهداف النشاط ومخرجاته التعليمية والمهارية للطلاب..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] outline-none resize-none font-medium shadow-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#0d281e] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/30"
            >
              <Send className="w-4 h-4 text-[#e6c566]" />
              <span>إرسال استمارة النشاط للمدير المباشر للاعتماد</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: TRACKING VIEW */}
      {activeTab === 'tracking' && (
        <div className="space-y-3 animate-fade-slide-up">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#c59b27]" />
              <span>طلباتي ومتابعة سير المعاملات ({myRequests.length})</span>
            </h2>
            <span className="text-[11px] text-[#c59b27] font-bold bg-[#c59b27]/10 px-2 py-0.5 rounded-full border border-[#c59b27]/20">
              تحديث فوري
            </span>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700 mb-1">
                لم تقم برفع أي طلبات حتى الآن
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                استخدم تبويب "استمارة رفع نشاط جديد" لبدء رفع أول نشاط للاعتماد.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] text-[#e6c566] text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>رفع نشاط جديد الآن</span>
              </button>
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
                    className={`bg-white p-4 sm:p-5 rounded-3xl shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 border-r-4 ${borderAccentColor}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
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
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-slate-600 bg-slate-50/90 p-2.5 rounded-2xl mb-3 border border-slate-100">
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
                        <span className="text-[10px] bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded-md font-mono">
                          معاملة: {r.transactionNumber}
                        </span>
                      )}
                    </div>

                    {r.summary && (
                      <div className="bg-slate-50/80 p-2.5 rounded-xl text-[11px] text-slate-600 line-clamp-2 italic mb-3 border border-slate-100">
                        {r.summary}
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(r)}
                        className="text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer bg-slate-50 hover:bg-amber-50/50 px-3 py-1.5 rounded-xl border border-slate-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#c59b27]" />
                        <span>عرض تفاصيل الاستمارة والتاريخ الإداري</span>
                      </button>

                      {r.status === 'returned_emp' && onResubmitRequest && (
                        <button
                          type="button"
                          onClick={() => onResubmitRequest(r.id)}
                          className="text-[11px] bg-[#c59b27] hover:bg-[#b0881e] text-[#081c15] font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all duration-150 shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>إعادة الرفع للمدير</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Full Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
