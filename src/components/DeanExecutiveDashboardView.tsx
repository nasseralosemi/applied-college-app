import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { ExportReportModal } from './ExportReportModal';
import { StatusBadge } from './StatusBadge';
import {
  Crown,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Search,
  TrendingUp,
  Globe,
  Layers,
  ShieldCheck,
  LayoutDashboard,
  FileCheck2,
  Activity,
  ChevronLeft,
  Share2,
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

  // Dynamic requests for analytics
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

  // Filtered requests for the activities list
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
    <div className="space-y-4 pb-6 font-['Tajawal',sans-serif]">
      {/* Standardized View Title & Header Banner (Mobile-Optimized) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] shrink-0">
            <Crown className="w-4 h-4 text-[#c59b27]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#1b4332] leading-tight">
              لوحة المتابعة التنفيذية - سعادة رئيس الكلية
            </h2>
            <p className="text-[10px] text-slate-500">
              متابعة مؤشرات الأداء، مسارات الأنشطة، والتوثيق الرسمي في منصة ارتقاء
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-[#c59b27] hover:bg-[#d4ab37] text-slate-950 text-[11px] font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline">تصدير التقرير الشامل</span>
          <span className="sm:hidden">تصدير التقرير</span>
        </button>
      </div>

      {/* Top Segmented Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">المؤشرات العامة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">الرسوم البيانية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activities')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">سجل الأنشطة ({totalActivities})</span>
        </button>
      </div>

      {/* KPI Cards Grid (Compact 2x2 on Mobile, 4-Cols on Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">إجمالي الأنشطة</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalActivities}</div>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
            <span className="font-bold text-emerald-700">{approvedFinal} معتمد</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{inWorkflow} تدقيق</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">الساعات التدريبية</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1">
            {totalTrainingHours} <span className="text-[10px] font-normal text-slate-400">ساعة</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            متوسط {(totalActivities > 0 ? totalTrainingHours / totalActivities : 0).toFixed(1)} س / نشاط
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800">موثقة بارتقاء</span>
            <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#e6c566] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{uploadedToIrtqaa}</div>
          <div className="text-[10px] text-emerald-800 mt-0.5 font-medium truncate">
            سجل مهاري وطني
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">الإنجاز الكلي</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {totalActivities > 0 ? Math.round((approvedFinal / totalActivities) * 100) : 100}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {deanApprovedCount} اعتماد رئاسة
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW (نظرة شاملة ومؤشرات الأداء)              */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-slide-up">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>حالة المعاملات الحالية</span>
                </h3>
                <span className="text-[10px] text-slate-400">تحديث فوري</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                  <span className="font-bold text-[11px]">معتمد وموثق نهائياً (ارتقاء)</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                    {uploadedToIrtqaa}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                  <span className="font-bold text-[11px]">معتمد وجاهز للرفع</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-blue-200 text-xs">
                    {requests.filter((r) => r.status === 'approved_final').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                  <span className="font-bold text-[11px]">قيد التدقيق والمراجعة</span>
                  <span className="font-black font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                    {inWorkflow}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance & Closing Status */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مرحلة كشوف الحضور والإغلاق</span>
                </h3>
                <span className="text-[10px] text-slate-400">منصة ارتقاء</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                  <span className="text-[11px]">إجمالي كشوف الحضور المرفوعة:</span>
                  <strong className="font-black font-mono text-xs">{attendanceUploadedCount}</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="font-bold text-[11px]">كشوف معتمدة ومعاملات مغلقة:</span>
                  <strong className="font-black font-mono text-emerald-700 text-xs">{attendanceApprovedCount}</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                  <span className="font-bold text-[11px]">أنشطة محالة للنشر بمنصة X:</span>
                  <strong className="font-black font-mono text-purple-700 text-xs">{xPublishedCount}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Recent Activities Preview (Mobile-Friendly Card List) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900">أحدث الأنشطة المسجلة بالكلية</h3>
                <p className="text-[10px] text-slate-400">نظرة سريعة على آخر الفعاليات المنجزة</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className="text-[11px] text-[#1b4332] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>سجل كافة الأنشطة ({totalActivities})</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 space-y-1">
              {requests.slice(0, 5).map((req) => (
                <div key={req.id} className="pt-2 pb-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 p-2 rounded-xl transition">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1b4332] font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                      #{req.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{req.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {req.presenter} • {req.branch} • {req.type} ({req.hours} س)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <StatusBadge status={req.status} />
                    <button
                      type="button"
                      onClick={() => setActiveRequestForDetails(req)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition active:scale-95 cursor-pointer inline-flex items-center gap-1"
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
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 animate-fade-slide-up">
          {/* Analytics Filter Header */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  الرسوم البيانية والتحليل الإحصائي
                </h3>
                <p className="text-[10px] text-slate-500">
                  تحليل كمي ونوعي للمسارات وفروع الكلية التطبيقية
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">الفرع:</span>
              <select
                value={analyticsBranchFilter}
                onChange={(e) => setAnalyticsBranchFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 outline-none focus:border-[#c59b27] cursor-pointer"
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

          {/* Charts Grid: Type Breakdown & Branch Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Chart 1: Activity Types */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#1b4332]" />
                  <h4 className="text-xs font-bold text-slate-900">
                    توزيع الأنشطة حسب المسارات والأنواع
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-[#1b4332] bg-[#1b4332]/5 px-2 py-0.5 rounded-lg">
                  {Object.keys(typeCounts).length} مسارات
                </span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(typeCounts).map(([type, count]) => {
                  const percentage = analyticsTotal > 0 ? Math.round((count / analyticsTotal) * 100) : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 text-[11px]">{type}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono text-[10px]">{percentage}%</span>
                          <span className="font-bold text-[#1b4332] bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-100">
                            {count}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#1b4332] to-[#c59b27] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: College Branches */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-700" />
                  <h4 className="text-xs font-bold text-slate-900">
                    التوزيع الجغرافي لفروع الكلية التطبيقية
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg">
                  {Object.keys(branchCounts).length} فروع
                </span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(branchCounts).map(([branch, data]) => {
                  const percentage = totalActivities > 0 ? Math.round((data.count / totalActivities) * 100) : 0;
                  return (
                    <div key={branch} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 text-[11px]">{branch}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono text-[9px]">{data.hours} س</span>
                          <span className="text-slate-400 font-mono text-[10px]">{percentage}%</span>
                          <span className="font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] border border-amber-200">
                            {data.count}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-600 via-[#c59b27] to-amber-300 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Modes & Top Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Delivery Modes */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800">أنماط التنفيذ والبيئة التدريبية</h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">عن بعد (افتراضي)</span>
                  <div className="text-base font-black text-blue-700 mt-1">
                    {remoteCount} <span className="text-[10px] font-normal text-slate-400">({analyticsTotal > 0 ? Math.round((remoteCount / analyticsTotal) * 100) : 0}%)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">حضوري (المقرات)</span>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    {inPersonCount} <span className="text-[10px] font-normal text-slate-400">({analyticsTotal > 0 ? Math.round((inPersonCount / analyticsTotal) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Funnel Summary */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1b4332]" />
                  <h4 className="text-xs font-bold text-slate-800">قمع التدفق المؤسسي (ارتقاء)</h4>
                </div>
                <span className="text-[10px] text-slate-400">مراحل المعاملة</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">1. المدخلة</span>
                  <strong className="text-sm font-black text-slate-800 font-mono">{totalActivities}</strong>
                </div>
                <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200">
                  <span className="text-[9px] text-blue-900 block">2. المعتمدة</span>
                  <strong className="text-sm font-black text-blue-700 font-mono">{approvedFinal}</strong>
                </div>
                <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <span className="text-[9px] text-emerald-900 block">3. ارتقاء</span>
                  <strong className="text-sm font-black text-emerald-700 font-mono">{uploadedToIrtqaa}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MASTER ACTIVITIES LIST (Mobile-Optimized Cards)   */}
      {/* ======================================================== */}
      {activeTab === 'activities' && (
        <div className="space-y-3 animate-fade-slide-up">
          {/* Filters & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-2.5 shadow-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالنشاط، المقدم، أو الوحدة..."
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="px-2 py-1.5 rounded-xl border border-slate-200 text-[11px] bg-slate-50 focus:bg-white outline-none cursor-pointer truncate"
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
                className="px-2 py-1.5 rounded-xl border border-slate-200 text-[11px] bg-slate-50 focus:bg-white outline-none cursor-pointer truncate"
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
                className="px-2 py-1.5 rounded-xl border border-slate-200 text-[11px] bg-slate-50 focus:bg-white outline-none cursor-pointer truncate"
              >
                <option value="all">كافة الحالات</option>
                <option value="completed">المكتملة</option>
                <option value="in_progress">قيد الاعتماد</option>
                <option value="uploaded_irtqaa">بارتقاء</option>
              </select>
            </div>
          </div>

          {/* Activities Cards (Identical Layout to Employee & Manager Views) */}
          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                لا توجد أنشطة مطابقة للبحث المحدد
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2.5 hover:border-slate-300 transition"
                >
                  {/* Top line: status and id */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      #{req.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {req.attendanceSheet?.status === 'approved' || req.isOfficiallyClosed ? (
                        <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          كشف الحضور معتمد ومغلق
                        </span>
                      ) : req.attendanceSheet ? (
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          كشف الحضور مرفوع
                        </span>
                      ) : null}
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  {/* Activity Name */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1b4332] leading-snug">
                      {req.name}
                    </h3>
                  </div>

                  {/* Info Chips (2 columns) */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-[#1b4332] shrink-0" />
                      <span className="text-slate-700 truncate">{req.presenter}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#1b4332] shrink-0" />
                      <span className="text-slate-700 truncate">{req.branch}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#1b4332] shrink-0" />
                      <span className="text-slate-600 font-mono text-[10px]">
                        {req.startDate || req.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1b4332] shrink-0" />
                      <span className="text-slate-600 font-bold text-[10px]">
                        {req.hours} ساعات ({req.type})
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      {req.deanApproved ? (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>معتمد رئاسياً</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">بانتظار المراجعة</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveRequestForDetails(req)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>اطلاع وتفاصيل</span>
                    </button>
                  </div>
                </div>
              ))
            )}
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
