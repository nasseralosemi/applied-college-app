import React, { useState } from 'react';
import { ActivityRequest, AttendanceSheet } from '../types';
import { StatusBadge } from './StatusBadge';
import { RequestDetailsModal } from './RequestDetailsModal';
import { AttendanceSheetModal } from './AttendanceSheetModal';
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
  FileSpreadsheet,
  Upload,
  Paperclip,
  Check,
  AlertCircle,
  Download,
  Eye,
  Sparkles,
  UserCheck,
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
  onUploadAttendanceSheet?: (requestId: number, attendanceData: AttendanceSheet) => void;
  onToggleForceEnded?: (requestId: number) => void;
  currentUserEmpNumber?: string;
}

export const EmployeeView: React.FC<Props> = ({
  requests,
  onSubmitRequest,
  onResubmitRequest,
  onUploadAttendanceSheet,
  onToggleForceEnded,
  currentUserEmpNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'tracking'>('form');
  const [selectedRequest, setSelectedRequest] = useState<ActivityRequest | null>(null);
  const [selectedAttendanceRequest, setSelectedAttendanceRequest] = useState<ActivityRequest | null>(null);

  // Per-request attendance upload form state
  const [attendanceDrafts, setAttendanceDrafts] = useState<
    Record<
      number,
      {
        fileName: string;
        fileSize: string;
        fileType: 'excel' | 'pdf';
        fileData?: string;
        attendeesCount: string;
        notes: string;
        error?: string;
      }
    >
  >({});

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

  // Check if activity has ended in time
  const isActivityEnded = (r: ActivityRequest): boolean => {
    if (r.forceActivityEnded) return true;
    const dateStr = r.endDate || r.startDate || r.date;
    if (!dateStr) return false;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    return dateStr <= todayStr;
  };

  // Helper for attendance form draft per request
  const getDraft = (id: number) => {
    return (
      attendanceDrafts[id] || {
        fileName: '',
        fileSize: '',
        fileType: 'excel' as const,
        attendeesCount: '',
        notes: '',
        error: '',
      }
    );
  };

  const updateDraft = (
    id: number,
    patch: Partial<{
      fileName: string;
      fileSize: string;
      fileType: 'excel' | 'pdf';
      fileData?: string;
      attendeesCount: string;
      notes: string;
      error?: string;
    }>
  ) => {
    setAttendanceDrafts((prev) => ({
      ...prev,
      [id]: {
        ...getDraft(id),
        ...patch,
      },
    }));
  };

  const handleSelectRealFile = (id: number, file: File) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    updateDraft(id, {
      fileName: file.name,
      fileSize: sizeStr,
      fileType: isPdf ? 'pdf' : 'excel',
      error: '',
    });
  };

  const handleApplySampleFile = (id: number, type: 'excel' | 'pdf', activityName: string) => {
    const cleanName = activityName.replace(/[\s\W]+/g, '_').slice(0, 30);
    if (type === 'excel') {
      updateDraft(id, {
        fileName: `كشف_حضور_${cleanName}_المعتمد.xlsx`,
        fileSize: '320 KB',
        fileType: 'excel',
        attendeesCount: '45',
        notes: 'تمت مطابقة أسماء المستفيدين مع السجل الأكاديمي والتحقق من التوقيعات.',
        error: '',
      });
    } else {
      updateDraft(id, {
        fileName: `كشف_حضور_${cleanName}_المعتمد.pdf`,
        fileSize: '680 KB',
        fileType: 'pdf',
        attendeesCount: '45',
        notes: 'كشف حضور معتمد ومختوم رسمياً من رئيس الوحدة المشرفة.',
        error: '',
      });
    }
  };

  const handleSubmitAttendanceSheet = (id: number) => {
    const draft = getDraft(id);
    if (!draft.fileName) {
      updateDraft(id, { error: 'يرجى إرفاق ملف كشف الحضور المعتمد (Excel أو PDF).' });
      return;
    }
    const count = parseInt(draft.attendeesCount, 10);
    if (isNaN(count) || count <= 0) {
      updateDraft(id, { error: 'يرجى إدخال عدد الحضور الفعلي في الكشف (أكبر من صفر).' });
      return;
    }

    if (onUploadAttendanceSheet) {
      const attendanceData: AttendanceSheet = {
        fileName: draft.fileName,
        fileSize: draft.fileSize || '350 KB',
        fileType: draft.fileType,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUserEmpNumber ? `الموظف #${currentUserEmpNumber}` : 'مقدم النشاط',
        attendeesCount: count,
        notes: draft.notes,
      };
      onUploadAttendanceSheet(id, attendanceData);
    }
  };

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

                    {/* PHASE: ATTENDANCE SHEET SECTION */}
                    {/* CASE 1: Request is approved_final and needs attendance sheet */}
                    {r.status === 'approved_final' && !r.attendanceSheet && (
                      <div className="mb-3">
                        {isActivityEnded(r) ? (
                          /* Activity has ended: Show the required "إرفاق كشف الحضور المعتمد" box */
                          <div className="bg-gradient-to-br from-amber-50/80 via-emerald-50/40 to-white border-2 border-[#c59b27] rounded-2xl p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2 mb-2.5 pb-2.5 border-b border-[#c59b27]/30">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#c59b27] text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                                  <FileSpreadsheet className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                                    <span>إرفاق كشف الحضور المعتمد</span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                      انتهت الفعالية
                                    </span>
                                  </h5>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    يرجى رفع كشف الحضور بصيغة (Excel / PDF) لتحويل المعاملة آلياً لمسؤول التوثيق (ناصر العصيمي)
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                                نهاية الفعالية: {r.endDate || r.startDate || r.date}
                              </span>
                            </div>

                            {/* File Upload Control */}
                            <div className="space-y-3">
                              {/* Drop / Select Zone */}
                              <div className="relative border-2 border-dashed border-slate-300 hover:border-[#c59b27] rounded-xl p-3 bg-white/80 transition-colors text-center">
                                {getDraft(r.id).fileName ? (
                                  <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-2">
                                      {getDraft(r.id).fileType === 'excel' ? (
                                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                                      )}
                                      <div className="text-right">
                                        <span className="text-xs font-bold text-slate-900 block font-mono dir-ltr">
                                          {getDraft(r.id).fileName}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {getDraft(r.id).fileSize} • ملف {getDraft(r.id).fileType === 'excel' ? 'Excel' : 'PDF'} جاهز للإرسال
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => updateDraft(r.id, { fileName: '', fileSize: '' })}
                                      className="text-[10px] text-rose-600 hover:text-rose-800 font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                                    >
                                      تغيير الملف
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <label className="cursor-pointer block">
                                      <Upload className="w-6 h-6 text-[#c59b27] mx-auto mb-1 animate-bounce" />
                                      <span className="text-xs font-bold text-slate-800 block">
                                        اضغط لاختيار كشف الحضور (Excel أو PDF)
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        يدعم صيغ (.xlsx, .xls, .csv, .pdf)
                                      </span>
                                      <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleSelectRealFile(r.id, e.target.files[0]);
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>

                                    {/* 1-Click Test Templates */}
                                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                                      <span className="text-[10px] text-slate-400 font-medium">أو تجربة نموذج جاهز:</span>
                                      <button
                                        type="button"
                                        onClick={() => handleApplySampleFile(r.id, 'excel', r.name)}
                                        className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1"
                                      >
                                        <FileSpreadsheet className="w-3 h-3 text-emerald-700" />
                                        <span>نموذج Excel (.xlsx)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleApplySampleFile(r.id, 'pdf', r.name)}
                                        className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1"
                                      >
                                        <FileText className="w-3 h-3 text-rose-700" />
                                        <span>نموذج PDF (.pdf)</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Form Inputs: Attendees Count & Notes */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    عدد الحضور الفعلي في الكشف <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="مثال: 45 مستفيداً"
                                    value={getDraft(r.id).attendeesCount}
                                    onChange={(e) => updateDraft(r.id, { attendeesCount: e.target.value, error: '' })}
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-medium"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    ملاحظات إضافية لمسؤول التوثيق (اختياري)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="أي ملاحظات حول الكشف أو التحقق..."
                                    value={getDraft(r.id).notes}
                                    onChange={(e) => updateDraft(r.id, { notes: e.target.value })}
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-medium"
                                  />
                                </div>
                              </div>

                              {getDraft(r.id).error && (
                                <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200 font-bold flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{getDraft(r.id).error}</span>
                                </p>
                              )}

                              {/* Submit Attendance Button */}
                              <button
                                type="button"
                                onClick={() => handleSubmitAttendanceSheet(r.id)}
                                className="w-full bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#0d281e] hover:from-[#143728] hover:to-[#081c15] text-[#e6c566] font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1b4332]/25 active:scale-95 transition-all duration-150 cursor-pointer border border-[#c59b27]/40"
                              >
                                <Send className="w-4 h-4 text-[#e6c566]" />
                                <span>إرسال كشف الحضور وتوجيه المعاملة لمسؤول التوثيق (ناصر العصيمي)</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Activity not ended yet: Inform user when it will be open */
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>
                                تاريخ الفعالية ({r.startDate || r.date} إلى {r.endDate || r.startDate || r.date}) • ستتاح خانة إرفاق كشف الحضور المعتمد فور انتهاء موعد الفعالية.
                              </span>
                            </div>
                            {onToggleForceEnded && (
                              <button
                                type="button"
                                onClick={() => onToggleForceEnded(r.id)}
                                className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-bold border border-amber-300 transition-all cursor-pointer shrink-0"
                              >
                                🧪 محاكاة انتهاء النشاط الآن للتجربة
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CASE 2: Attendance sheet submitted, pending Nasser Al-Osaimi */}
                    {r.status === 'attendance_submitted' && r.attendanceSheet && (
                      <div className="bg-gradient-to-r from-amber-50/90 via-emerald-50/70 to-slate-50 border border-amber-300 rounded-2xl p-3.5 mb-3 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200/60">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <h5 className="font-bold text-slate-900 text-xs">
                              تم إرفاق كشف الحضور المعتمد بنجاح
                            </h5>
                          </div>
                          <span className="text-[10px] font-bold bg-[#1b4332] text-[#e6c566] px-2.5 py-0.5 rounded-full border border-[#c59b27]/30">
                            محال آلياً لمسؤول التوثيق (ناصر العصيمي)
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            {r.attendanceSheet.fileType === 'excel' ? (
                              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-rose-600" />
                            )}
                            <span className="font-bold font-mono dir-ltr">{r.attendanceSheet.fileName}</span>
                            <span className="text-slate-400">({r.attendanceSheet.fileSize})</span>
                            <span className="text-emerald-800 font-bold">• {r.attendanceSheet.attendeesCount} حضور</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedAttendanceRequest(r)}
                            className="inline-flex items-center gap-1 text-[11px] text-[#1b4332] hover:text-[#c59b27] font-bold px-2.5 py-1 bg-slate-100 hover:bg-amber-50 rounded-lg border border-slate-200 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#c59b27]" />
                            <span>معاينة كشف الحضور</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                          المعاملة بانتظار قيام مسؤول التوثيق (ناصر العصيمي) بمطابقة الكشف واعتماد التوثيق النهائي وإغلاق المعاملة رسمياً في منصة ارتقاء.
                        </p>
                      </div>
                    )}

                    {/* CASE 3: Fully verified and closed in Irtiqa */}
                    {r.status === 'uploaded_irtqaa' && r.attendanceSheet && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-2xl p-3 mb-3 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-emerald-950 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>اكتملت كافة مراحل المعاملة رسمياً، وتم اعتماد التوثيق وإغلاق الطلب في منصة ارتقاء</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedAttendanceRequest(r)}
                            className="text-[10px] text-[#1b4332] font-bold px-2 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100/60 cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-emerald-700" />
                            <span>كشف الحضور المعتمد</span>
                          </button>
                        </div>
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

      {/* Attendance Sheet Preview Modal */}
      <AttendanceSheetModal
        request={selectedAttendanceRequest}
        isOpen={Boolean(selectedAttendanceRequest)}
        onClose={() => setSelectedAttendanceRequest(null)}
      />
    </div>
  );
};
