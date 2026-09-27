import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { ExportReportModal } from './ExportReportModal';
import { StatusBadge } from './StatusBadge';
import {
  Crown,
  Award,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  Globe,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  LayoutDashboard,
  FileCheck2,
  Activity,
  CheckCheck,
  ChevronLeft
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
}

export const DeanExecutiveDashboardView: React.FC<Props> = ({ requests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [analyticsBranchFilter, setAnalyticsBranchFilter] = useState('all');
  const [activeRequestForDetails, setActiveRequestForDetails] = useState<ActivityRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'activities'>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Executive Core Calculations
  const totalActivities = requests.length;
  const uploadedToIrtqaa = requests.filter((r) => r.status === 'uploaded_irtqaa').length;
  const approvedFinal = requests.filter((r) => r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length;
  const inWorkflow = requests.filter(
    (r) =>
      r.status === 'pending_manager' ||
      r.status === 'pending_auditor' ||
      r.status === 'returned_emp' ||
      r.status === 'returned_manager'
  ).length;

  const totalTrainingHours = requests.reduce(
    (sum, r) => sum + (parseFloat(String(r.hours)) || 0),
    0
  );

  const deanApprovedCount = requests.filter(
    (r) => r.deanApproved === true || r.status === 'approved_final' || r.status === 'uploaded_irtqaa'
  ).length;
  const xPublishedCount = requests.filter((r) => r.xPlatformPublish === true).length;

  // Attendance Sheets Metrics
  const attendanceUploadedCount = requests.filter((r) => r.attendanceSheet).length;
  const attendanceApprovedCount = requests.filter(
    (r) => r.attendanceSheet?.status === 'approved' || r.isOfficiallyClosed
  ).length;

  // Dynamic requests for analytics (support optional branch filter in analytics)
  const analyticsRequests =
    analyticsBranchFilter === 'all'
      ? requests
      : requests.filter((r) => r.branch === analyticsBranchFilter);

  const analyticsTotal = analyticsRequests.length;
  const remoteCount = analyticsRequests.filter((r) => r.deliveryMode === 'عن بعد').length;
  const inPersonCount = analyticsRequests.filter((r) => r.deliveryMode === 'حضوري').length;
  const hybridCount = analyticsRequests.filter((r) => r.deliveryMode === 'مدمج').length;

  // Breakdown by Type
  const typeCounts: Record<string, number> = {};
  analyticsRequests.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  // Breakdown by Supervising Unit
  const unitCounts: Record<string, number> = {};
  analyticsRequests.forEach((r) => {
    unitCounts[r.unit] = (unitCounts[r.unit] || 0) + 1;
  });

  // Breakdown by Branch
  const branchCounts: Record<string, { count: number; hours: number }> = {};
  requests.forEach((r) => {
    const branchKey = r.branch || 'المقر الرئيسي';
    if (!branchCounts[branchKey]) {
      branchCounts[branchKey] = { count: 0, hours: 0 };
    }
    branchCounts[branchKey].count += 1;
    branchCounts[branchKey].hours += parseFloat(String(r.hours)) || 0;
  });

  // Filtered requests for the activities table
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.presenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.coordinatorName && r.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch = selectedBranchFilter === 'all' || r.branch === selectedBranchFilter;
    const matchesType = selectedTypeFilter === 'all' || r.type === selectedTypeFilter;
    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'completed'
        ? r.status === 'uploaded_irtqaa' || r.status === 'approved_final'
        : selectedStatusFilter === 'in_progress'
        ? r.status === 'pending_manager' || r.status === 'pending_auditor'
        : r.status === selectedStatusFilter;

    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  const allBranches = Array.from(new Set(requests.map((r) => r.branch))).filter(Boolean);
  const allTypes = Array.from(new Set(requests.map((r) => r.type))).filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-slide-up text-right font-['Tajawal',sans-serif]">
      {/* Main Executive Hero Header */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#143728] to-[#081c15] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#c59b27]/30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#c59b27]/20 border border-[#c59b27]/40 text-[#e6c566] flex items-center justify-center shadow-inner shrink-0">
              <Crown className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#c59b27] text-slate-950 font-sans">
                  القيادة الأكاديمية والتنفيذية
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                  الكلية التطبيقية - جامعة المجمعة
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                لوحة المتابعة التنفيذية - سعادة رئيس الكلية
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                متابعة شمولية حية لكافة مؤشرات الأداء، مسارات الأنشطة، اعتمادات الفروع، والتوثيق الرسمي في منصة ارتقاء الوطنية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-right shrink-0 min-w-[190px]">
              <span className="text-[11px] text-[#e6c566] font-bold block">معدل الإنجاز المؤسسي</span>
              <div className="text-3xl font-black text-white mt-0.5">
                {totalActivities > 0 ? Math.round((approvedFinal / totalActivities) * 100) : 100}%
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                {approvedFinal} من أصل {totalActivities} نشاط معتمد نهائياً
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-3.5 rounded-2xl bg-[#c59b27] hover:bg-[#d4ab37] text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer border border-white/20 shrink-0 self-stretch justify-center"
            >
              <FileSpreadsheet className="w-5 h-5 text-slate-950" />
              <div className="text-right">
                <span className="block leading-tight font-extrabold">تصدير التقرير التنفيذي الشامل</span>
                <span className="text-[9px] text-slate-800 font-semibold block">طباعة رسمية / Excel</span>
              </div>
            </button>
          </div>
        </div>

        {/* Executive Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-[#c59b27] text-slate-950 shadow-md font-extrabold scale-[1.02]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>نظرة شاملة ومؤشرات الأداء</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-[#c59b27] text-slate-950 shadow-md font-extrabold scale-[1.02]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>الرسوم البيانية والتحليل الإحصائي</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'activities'
                  ? 'bg-[#c59b27] text-slate-950 shadow-md font-extrabold scale-[1.02]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>سجل كافة الأنشطة والمتابعة ({totalActivities})</span>
            </button>
          </div>

          <div className="text-[11px] text-emerald-200/80 font-mono hidden lg:block">
            إجمالي الساعات المعتمدة: {totalTrainingHours} ساعة
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Common Core Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الأنشطة والبرامج</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalActivities}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <span className="font-bold text-emerald-700">{approvedFinal} معتمد</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{inWorkflow} قيد المعالجة</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مجموع الساعات التدريبية</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1b4332] mt-2">
            {totalTrainingHours} <span className="text-xs font-normal text-slate-400">ساعة</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <span>متوسط {totalActivities > 0 ? (totalTrainingHours / totalActivities).toFixed(1) : 0} ساعة / نشاط</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">موثقة في منصة ارتقاء</span>
            <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{uploadedToIrtqaa}</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-800 font-medium">
            <span>توثيق مكتمل في السجل المهاري الوطني</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">اعتماد رئيس الكلية</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2">{deanApprovedCount}</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">{xPublishedCount}</span>
            <span>نشاط محال للإعلان في منصة X</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW (نظرة شاملة ومؤشرات الأداء)              */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-slide-up">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Quick Status Breakdown */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-[#1b4332] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#c59b27]" />
                  <span>حالة المعاملات الحالية</span>
                </h3>
                <span className="text-[10px] text-slate-400">تحديث فوري</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                  <span className="font-bold">معتمد وموثق نهائياً (ارتقاء)</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {uploadedToIrtqaa}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                  <span className="font-bold">معتمد وجاهز للرفع</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    {requests.filter((r) => r.status === 'approved_final').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                  <span className="font-bold">قيد إجراءات التدقيق والمراجعة</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200">
                    {inWorkflow}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance & Closing Status */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-[#1b4332] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>مرحلة كشوف الحضور والإغلاق</span>
                </h3>
                <span className="text-[10px] text-slate-400">منصة ارتقاء</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                  <span>إجمالي كشوف الحضور المرفوعة:</span>
                  <strong className="font-black font-mono">{attendanceUploadedCount}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="font-bold">كشوف معتمدة ومعاملات مغلقة رسمياً:</span>
                  <strong className="font-black font-mono text-emerald-700">{attendanceApprovedCount}</strong>
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  تتم مطابقة أعداد الحضور وتوثيقها تلقائياً لضمان استحقاق الساعات في السجل المهاري.
                </p>
              </div>
            </div>

            {/* Action Card: Switch to Full Analytics */}
            <div className="bg-gradient-to-br from-slate-900 to-[#1b4332] text-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-[#c59b27] text-slate-950 font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                  الرسوم البيانية المتقدمة
                </span>
                <h3 className="text-base font-black">التحليل الإحصائي الشامل</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  استعرض الرسوم البيانية التفاعلية، تصنيف المسارات، والتوزيع الجغرافي لفروع الكلية ووحداتها.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className="mt-4 w-full py-2.5 px-4 bg-[#c59b27] hover:bg-[#d4ab37] text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>فتح صفحة الرسوم البيانية والإحصاء</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Recent Activities Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">أحدث الأنشطة المعتمدة في الكلية</h3>
                <p className="text-xs text-slate-400">نظرة سريعة على آخر الفعاليات المنجزة</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className="text-xs text-[#1b4332] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>عرض سجل كافة الأنشطة ({totalActivities})</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((req) => (
                <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 p-2 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b4332] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100">
                      #{req.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{req.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {req.presenter} • {req.branch} • {req.type} ({req.hours} س)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={req.status} />
                    <button
                      type="button"
                      onClick={() => setActiveRequestForDetails(req)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>اطلاع</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DEDICATED ANALYTICS & CHARTS PAGE                 */}
      {/* (صفحة الرسوم البيانية والتحليل الإحصائي المتقدمة)        */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-slide-up">
          {/* Analytics Header Bar with Interactive Branch Selector */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shadow-md shadow-[#1b4332]/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    صفحة الرسوم البيانية والتحليل الإحصائي
                  </h2>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    مباشر وتفاعلي
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  تحليل كمي ونوعي لكافة برامج ومسارات الكلية التطبيقية ومعدلات الإنجاز المؤسسي
                </p>
              </div>
            </div>

            {/* Branch Slice Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">تصفية التحليلات حسب الفرع:</span>
              <select
                value={analyticsBranchFilter}
                onChange={(e) => setAnalyticsBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 outline-none focus:border-[#c59b27] cursor-pointer shadow-xs"
              >
                <option value="all">كافة الفروع والمقرات ({requests.length})</option>
                {allBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Charts Grid: Paths Distribution & Geographic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Distribution by Activity Type / Track */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b4332] flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        توزيع الأنشطة حسب المسارات والأنواع
                      </h3>
                      <p className="text-[11px] text-slate-400">تصنيف البرامج التدريبية والأكاديمية</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1b4332] bg-[#1b4332]/5 px-2.5 py-1 rounded-xl">
                    {Object.keys(typeCounts).length} مسارات
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const percentage = analyticsTotal > 0 ? Math.round((count / analyticsTotal) * 100) : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-[11px]">
                              {percentage}%
                            </span>
                            <span className="font-bold text-[#1b4332] bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-100">
                              {count} نشاط
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#1b4332] to-[#c59b27] h-full rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>إجمالي الأنشطة في هذا التصنيف: <strong>{analyticsTotal}</strong></span>
                <span className="text-emerald-700 font-bold">مكتمل الرصد</span>
              </div>
            </div>

            {/* Chart 2: Distribution by College Branch */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        التوزيع الجغرافي لفروع الكلية التطبيقية
                      </h3>
                      <p className="text-[11px] text-slate-400">حجم الأنشطة ومجموع الساعات في كل فرع</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl">
                    {Object.keys(branchCounts).length} فروع ومقرات
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {Object.entries(branchCounts).map(([branch, data]) => {
                    const percentage = totalActivities > 0 ? Math.round((data.count / totalActivities) * 100) : 0;
                    return (
                      <div key={branch} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{branch}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-[10px]">{data.hours} ساعة</span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {percentage}%
                            </span>
                            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[10px] border border-amber-200">
                              {data.count} نشاط
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-600 via-[#c59b27] to-amber-300 h-full rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>تغطية شاملة لفروع محافظة المجمعة والمحافظات المجاورة</span>
                <span className="text-amber-800 font-bold">100% نشطة</span>
              </div>
            </div>
          </div>

          {/* Secondary Analytical Grid: Delivery Modes, Units Ranking, & Workflow Funnel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Delivery Mode (حضوري vs عن بعد vs مدمج) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold text-slate-800">أنماط التنفيذ والبيئة التدريبية</h4>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">عن بعد (افتراضي)</span>
                  </div>
                  <span className="text-sm font-black text-blue-700">
                    {remoteCount} ({analyticsTotal > 0 ? Math.round((remoteCount / analyticsTotal) * 100) : 0}%)
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">حضوري (في المقرات)</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">
                    {inPersonCount} ({analyticsTotal > 0 ? Math.round((inPersonCount / analyticsTotal) * 100) : 0}%)
                  </span>
                </div>

                {hybridCount > 0 && (
                  <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-800">مدمج (حضوري وافتراضي)</span>
                    </div>
                    <span className="text-sm font-black text-purple-700">
                      {hybridCount} ({analyticsTotal > 0 ? Math.round((hybridCount / analyticsTotal) * 100) : 0}%)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                توازن استراتيجي بين التدريب الرقمي واسع النطاق والورش التطبيقية الميدانية في المعامل.
              </p>
            </div>

            {/* Top Supervising Units */}
            <div className="md:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#c59b27]" />
                  <h4 className="text-xs font-extrabold text-slate-800">أبرز الوحدات المنفذة والمشرفة على الأنشطة</h4>
                </div>
                <span className="text-[10px] text-slate-400">ترتيب حسب حجم الإنجاز</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(unitCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([unit, count], idx) => (
                    <div
                      key={unit}
                      className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between hover:bg-slate-100/70 transition"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-[#c59b27] text-slate-950 shadow-sm'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-[#1b4332] text-[#e6c566]'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{unit}</span>
                      </div>
                      <span className="text-xs font-black text-[#1b4332] shrink-0 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {count} نشاط
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Workflow Funnel: Pipeline From Request to Official Closing */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1b4332]" />
                <h3 className="text-sm font-black text-slate-900">
                  سلسلة الاعتماد والتوثيق المؤسسي (Workflow Pipeline)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">منصة ارتقاء الوطنية</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">1. إجمالي الطلبات المدخلة</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{totalActivities}</span>
                <span className="text-[10px] text-slate-400 block mt-1">100% مدخلات المنظومة</span>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                <span className="text-[10px] text-blue-900 font-bold block mb-1">2. استوفت التدقيق والاعتماد</span>
                <span className="text-2xl font-black text-blue-700 font-mono">{approvedFinal}</span>
                <span className="text-[10px] text-blue-600 block mt-1">
                  {totalActivities > 0 ? Math.round((approvedFinal / totalActivities) * 100) : 0}% معدل القبول
                </span>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-amber-900 font-bold block mb-1">3. موثقة في منصة ارتقاء</span>
                <span className="text-2xl font-black text-amber-800 font-mono">{uploadedToIrtqaa}</span>
                <span className="text-[10px] text-amber-700 block mt-1">
                  سجل مهاري معتمد
                </span>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-900 font-bold block mb-1">4. كشف الحضور مغلق رسمياً</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">{attendanceApprovedCount}</span>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  إغلاق نهائي للمعاملة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MASTER ACTIVITIES TABLE (سجل كافة الأنشطة)        */}
      {/* ======================================================== */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4 animate-fade-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-[#1b4332]">
                سجل استعراض كافة الأنشطة والمتابعة اللحظية ({filteredRequests.length})
              </h3>
              <p className="text-xs text-slate-400">
                استعراض تفصيلي لجميع طلبات الأنشطة في الكلية وحالات الاعتماد والرفع
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث سريع في الاستمارات..."
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white outline-none cursor-pointer"
              >
                <option value="all">كافة الفروع</option>
                {allBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white outline-none cursor-pointer"
              >
                <option value="all">كافة الأنواع</option>
                {allTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white outline-none cursor-pointer"
              >
                <option value="all">كافة الحالات</option>
                <option value="completed">المكتملة والمنجزة</option>
                <option value="in_progress">قيد الاعتماد والمراجعة</option>
                <option value="uploaded_irtqaa">الموثقة بارتقاء</option>
              </select>
            </div>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold">
                  <th className="py-3 px-3">النشاط</th>
                  <th className="py-3 px-3">النوع والمسار</th>
                  <th className="py-3 px-3">المقدم والوحدة</th>
                  <th className="py-3 px-3">الفرع والتاريخ</th>
                  <th className="py-3 px-3">الساعات</th>
                  <th className="py-3 px-3">حالة المنظومة</th>
                  <th className="py-3 px-3">كشف الحضور</th>
                  <th className="py-3 px-3">اعتماد الرئاسة</th>
                  <th className="py-3 px-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-[#1b4332] max-w-xs">{req.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">#{req.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {req.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{req.presenter}</div>
                      <div className="text-[10px] text-slate-400">{req.unit}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800">{req.branch}</div>
                      <div className="text-[10px] text-slate-400">{req.startDate}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {req.hours} س
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-3">
                      {req.attendanceSheet?.status === 'approved' || req.isOfficiallyClosed ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          معتمد ومغلق
                        </span>
                      ) : req.attendanceSheet ? (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          مرفوع ({req.attendanceSheet.attendeesCount || 35})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">غير مرفوع</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {req.deanApproved ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>معتمد رسمياً</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">بانتظار المراجعة</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveRequestForDetails(req)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>اطلاع</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {activeRequestForDetails && (
        <RequestDetailsModal
          request={activeRequestForDetails}
          onClose={() => setActiveRequestForDetails(null)}
        />
      )}

      {/* Export Executive Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        requests={requests}
      />
    </div>
  );
};
