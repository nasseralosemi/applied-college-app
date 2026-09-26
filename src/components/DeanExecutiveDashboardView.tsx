import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
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
  BellOff,
  Eye,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Globe,
  Share2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
}

export const DeanExecutiveDashboardView: React.FC<Props> = ({ requests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [activeRequestForDetails, setActiveRequestForDetails] = useState<ActivityRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'analytics'>('overview');
  const [copiedNotificationNotice, setCopiedNotificationNotice] = useState(false);

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

  const deanApprovedCount = requests.filter((r) => r.deanApproved === true || r.status === 'approved_final' || r.status === 'uploaded_irtqaa').length;
  const xPublishedCount = requests.filter((r) => r.xPlatformPublish === true).length;

  const remoteCount = requests.filter((r) => r.deliveryMode === 'عن بعد').length;
  const inPersonCount = requests.filter((r) => r.deliveryMode === 'حضوري').length;

  // Breakdown by Type
  const typeCounts: Record<string, number> = {};
  requests.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  // Breakdown by Supervising Unit
  const unitCounts: Record<string, number> = {};
  requests.forEach((r) => {
    unitCounts[r.unit] = (unitCounts[r.unit] || 0) + 1;
  });

  // Breakdown by Branch
  const branchCounts: Record<string, number> = {};
  requests.forEach((r) => {
    branchCounts[r.branch] = (branchCounts[r.branch] || 0) + 1;
  });

  // Filtered requests
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

  // Export Executive Summary to CSV
  const handleExportCSV = () => {
    const headers = [
      'رقم النشاط',
      'اسم النشاط',
      'المسار / النوع',
      'مقدم النشاط',
      'الوحدة المشرفة',
      'الفرع',
      'التاريخ',
      'عدد الساعات',
      'نمط التنفيذ',
      'حالة النشاط',
      'اعتماد رئيس الكلية',
      'منصة ارتقاء',
    ];

    const rows = filteredRequests.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.type}"`,
      `"${r.presenter.replace(/"/g, '""')}"`,
      `"${r.unit}"`,
      `"${r.branch}"`,
      r.startDate,
      r.hours,
      r.deliveryMode,
      r.status,
      r.deanApproved ? 'معتمد' : 'بانتظار',
      r.status === 'uploaded_irtqaa' ? 'تم الرفع' : 'قيد المعالجة',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `التقرير_التنفيذي_رئيس_الكلية_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up text-right font-['Tajawal',sans-serif]">
      {/* Top Notification Mute Directive Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b4332]/5 via-amber-50/40 to-slate-50 border border-[#c59b27]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#e6c566] flex items-center justify-center shrink-0 shadow-md shadow-[#1b4332]/20">
            <BellOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-[#e6c566] border border-[#c59b27]/40">
                وضع المتابعة والاطلاع الفوري الهادئ
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                الإشعارات المباشرة معطلة
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              تم إلغاء التنبيهات والإشعارات الفورية عن حساب سعادة رئيس الكلية نهائياً، لتوفير بيئة متابعة استراتيجية هادئة عند الدخول فقط.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] text-xs font-extrabold flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-[#c59b27]/30"
        >
          <Download className="w-4 h-4" />
          <span>تصدير التقرير التنفيذي الشامل</span>
        </button>
      </div>

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
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#c59b27] text-slate-950">
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
                متابعة شمولية حية لكافة مؤشرات الأداء، مسارات الأنشطة، اعتمادات الكليات، ومعدلات الإنجاز في منصة ارتقاء الوطنية.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-right shrink-0 min-w-[200px]">
            <span className="text-[11px] text-[#e6c566] font-bold block">معدل الإنجاز المؤسسي</span>
            <div className="text-3xl font-black text-white mt-0.5">
              {totalActivities > 0 ? Math.round((approvedFinal / totalActivities) * 100) : 100}%
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5">
              {approvedFinal} من أصل {totalActivities} نشاط معتمد نهائياً
            </p>
          </div>
        </div>

        {/* Executive Quick Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#c59b27] text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            نظرة شاملة ومؤشرات الأداء
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#c59b27] text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            الرسوم البيانية والتحليل الإحصائي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-[#c59b27] text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            سجل كافة الأنشطة والمتابعة ({totalActivities})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
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

      {/* Tab 1: Overview & Analytics */}
      {(activeTab === 'overview' || activeTab === 'analytics') && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Distribution by Activity Type */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b4332] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      توزيع الأنشطة حسب المسارات والأنواع
                    </h3>
                    <p className="text-[11px] text-slate-400">تصنيف البرامج التدريبية والطلابية</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1b4332] bg-[#1b4332]/5 px-2.5 py-1 rounded-xl">
                  {Object.keys(typeCounts).length} مسارات
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {Object.entries(typeCounts).map(([type, count]) => {
                  const percentage = Math.round((count / totalActivities) * 100);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono text-[11px]">
                            {percentage}%
                          </span>
                          <span className="font-bold text-[#1b4332] bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
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

            {/* Chart 2: Distribution by College Branch */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      التوزيع الجغرافي لفروع الكلية
                    </h3>
                    <p className="text-[11px] text-slate-400">حجم الأنشطة المنفذة في كل فرع</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl">
                  {Object.keys(branchCounts).length} فروع
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {Object.entries(branchCounts).map(([branch, count]) => {
                  const percentage = Math.round((count / totalActivities) * 100);
                  return (
                    <div key={branch} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{branch}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono text-[11px]">
                            {percentage}%
                          </span>
                          <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">
                            {count} نشاط
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secondary Analytics Row: Units & Modes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Delivery Mode (حضوري vs عن بعد) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 mb-3">نمط التنفيذ والحضور</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">عن بعد (افتراضي)</span>
                  </div>
                  <span className="text-sm font-black text-blue-700">
                    {remoteCount} ({totalActivities > 0 ? Math.round((remoteCount / totalActivities) * 100) : 0}%)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">حضوري (في المقرات)</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">
                    {inPersonCount} ({totalActivities > 0 ? Math.round((inPersonCount / totalActivities) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Top Supervising Units */}
            <div className="md:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 mb-3">أبرز الوحدات المشرفة والمنفذة للأنشطة</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(unitCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([unit, count], idx) => (
                    <div
                      key={unit}
                      className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-md bg-[#1b4332] text-[#e6c566] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{unit}</span>
                      </div>
                      <span className="text-xs font-black text-[#1b4332] shrink-0 font-mono">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Master Activities Table (Always accessible or active on click) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-[#1b4332]">
              سجل استعراض كافة الأنشطة والمتابعة اللحظية
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

      {/* Details Modal */}
      {activeRequestForDetails && (
        <RequestDetailsModal
          request={activeRequestForDetails}
          onClose={() => setActiveRequestForDetails(null)}
        />
      )}
    </div>
  );
};
