import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import { MediaPublishBadge } from './MediaPublishBadge';
import {
  Share2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Search,
  Eye,
  Calendar,
  Building2,
  Users,
  MapPin,
  Sparkles,
  Megaphone,
  ArrowRight,
  Globe,
  Radio,
  FileText,
  AlertCircle,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { NavTabKey } from './BottomNav';

interface Props {
  requests: ActivityRequest[];
  onUpdatePrStatus: (
    requestId: number,
    prStatus: 'pending_pr' | 'published_pr',
    tweetDraft?: string,
    prNotes?: string,
    coverageUrl?: string
  ) => void;
  isAdminViewing?: boolean;
  onReturnToAdmin?: () => void;
  activeNavTab?: NavTabKey;
}

export const PRDashboardView: React.FC<Props> = ({
  requests,
  onUpdatePrStatus,
  isAdminViewing,
  onReturnToAdmin,
  activeNavTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'published'>('all');

  React.useEffect(() => {
    if (activeNavTab === 'pending') {
      setSelectedStatusFilter('pending');
    } else if (activeNavTab === 'approved') {
      setSelectedStatusFilter('published');
    } else if (activeNavTab === 'activities' || activeNavTab === 'returned') {
      setSelectedStatusFilter('all');
    }
  }, [activeNavTab]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [activeRequestForDetails, setActiveRequestForDetails] = useState<ActivityRequest | null>(null);

  // Per-card editing drafts, notes, and coverage URLs
  const [editingDrafts, setEditingDrafts] = useState<Record<number, string>>({});
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [editingUrls, setEditingUrls] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter activities sent to PR (where xPlatformPublish is true)
  const prActivities = requests.filter((r) => r.xPlatformPublish === true);

  const totalPr = prActivities.length;
  const pendingPr = prActivities.filter((r) => r.prStatus !== 'published_pr').length;
  const publishedPr = prActivities.filter((r) => r.prStatus === 'published_pr').length;
  const completionRate = totalPr > 0 ? Math.round((publishedPr / totalPr) * 100) : 0;

  // Filtered list
  const filteredActivities = prActivities.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.presenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'published'
        ? r.prStatus === 'published_pr'
        : r.prStatus !== 'published_pr';

    const matchesType = selectedTypeFilter === 'all' ? true : r.type === selectedTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper to generate default tweet draft
  const generateDefaultTweet = (req: ActivityRequest): string => {
    const locationText =
      req.deliveryMode === 'عن بعد'
        ? req.meetingUrl
          ? `عن بعد (عبر الرابط)`
          : `عن بعد (المنصة الافتراضية)`
        : req.physicalLocation || req.location || req.branch;

    return `يسر #الكلية_التطبيقية بجامعة المجمعة دعوتكم لحضور:

✨ "${req.name}" (${req.type})
🎙️ تقديم: ${req.presenter}
🗓️ التاريخ: ${req.startDate}م
⏰ الوقت: ${req.startTime} | ⏳ الساعات: ${req.hours} ساعة
📍 المقر: ${locationText}
🎯 الفئة: ${req.targetAudience}

#جامعة_المجمعة #ارتقاء #أنشطة_الكلية`;
  };

  const handleCopyTweet = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePublishToggle = (req: ActivityRequest) => {
    const newStatus = req.prStatus === 'published_pr' ? 'pending_pr' : 'published_pr';
    const draft = editingDrafts[req.id] !== undefined ? editingDrafts[req.id] : (req.prTweetDraft || generateDefaultTweet(req));
    const note = editingNotes[req.id] !== undefined ? editingNotes[req.id] : (req.prNotes || '');
    const url = editingUrls[req.id] !== undefined ? editingUrls[req.id] : (req.prCoverageUrl || '');
    onUpdatePrStatus(req.id, newStatus, draft, note, url);
  };

  const handleSaveDraft = (req: ActivityRequest) => {
    const draft = editingDrafts[req.id] !== undefined ? editingDrafts[req.id] : (req.prTweetDraft || generateDefaultTweet(req));
    const note = editingNotes[req.id] !== undefined ? editingNotes[req.id] : (req.prNotes || '');
    const url = editingUrls[req.id] !== undefined ? editingUrls[req.id] : (req.prCoverageUrl || '');
    onUpdatePrStatus(req.id, req.prStatus || 'pending_pr', draft, note, url);
  };

  const activityTypes = Array.from(new Set(prActivities.map((r) => r.type)));

  return (
    <div className="space-y-4 pb-8 font-['Tajawal',sans-serif] text-right">
      {/* Bento Grid Header & PR Filter Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Bento Hero Tile: Spans 2 cols on mobile, 4 cols on desktop */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 bg-white/90 backdrop-blur-md rounded-[32px] p-4 sm:p-5 border border-[#46523B]/12 shadow-[0_8px_24px_rgba(70,82,59,0.04)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#46523B] via-[#A08D52] to-[#46523B]" />
          
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#46523B] text-[#A08D52] flex items-center justify-center shrink-0 border border-[#A08D52]/40 shadow-xs">
                <Share2 className="w-5 h-5 text-[#A08D52]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-900 border border-sky-200">
                    العلاقات العامة
                  </span>
                  <span className="text-[10px] font-bold text-[#A08D52]">
                    التغطية والنشر الإعلامي
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-[#46523B] mt-0.5">
                  منظومة نشر فعاليات الكلية في منصة 𝕏
                </h2>
              </div>
            </div>

            <span className="text-[10px] bg-slate-900 text-white font-bold px-2.5 py-1 rounded-full font-mono flex items-center gap-1 shrink-0 self-start sm:self-center">
              <span>𝕏</span>
              <span>@AppliedCollege_MU</span>
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">معدل التغطية الإعلامية المكتملة:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#46523B]">{completionRate}%</span>
              <span className="text-slate-400">({publishedPr} من {totalPr})</span>
            </div>
          </div>
        </div>

        {/* Bento Interactive Tile 1: المحالة للنشر */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('all')}
          className={`col-span-1 p-3.5 rounded-[28px] text-right flex flex-col justify-between transition-all cursor-pointer select-none border group ${
            selectedStatusFilter === 'all'
              ? 'bg-[#46523B] text-white border-[#A08D52] shadow-md ring-2 ring-[#A08D52]/30'
              : 'bg-white text-slate-700 border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.03)] hover:border-[#46523B]/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${selectedStatusFilter === 'all' ? 'text-white' : 'text-slate-500'}`}>
              كل المعاملات
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${selectedStatusFilter === 'all' ? 'bg-white/20 text-[#A08D52]' : 'bg-blue-50 text-blue-700'}`}>
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${selectedStatusFilter === 'all' ? 'text-white' : 'text-slate-900'}`}>
            {totalPr}
          </div>
          <span className={`text-[10px] mt-1 ${selectedStatusFilter === 'all' ? 'text-white/80' : 'text-slate-400'}`}>
            عرض الكل ←
          </span>
        </button>

        {/* Bento Interactive Tile 2: قيد التجهيز */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('pending')}
          className={`col-span-1 p-3.5 rounded-[28px] text-right flex flex-col justify-between transition-all cursor-pointer select-none border group ${
            selectedStatusFilter === 'pending'
              ? 'bg-[#46523B] text-white border-[#A08D52] shadow-md ring-2 ring-[#A08D52]/30'
              : 'bg-white text-slate-700 border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.03)] hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${selectedStatusFilter === 'pending' ? 'text-amber-200' : 'text-slate-500'}`}>
              قيد التجهيز
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${selectedStatusFilter === 'pending' ? 'bg-white/20 text-[#A08D52]' : 'bg-amber-50 text-amber-700'}`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${selectedStatusFilter === 'pending' ? 'text-white' : 'text-amber-700'}`}>
            {pendingPr}
          </div>
          <span className={`text-[10px] mt-1 ${selectedStatusFilter === 'pending' ? 'text-amber-200' : 'text-slate-400'}`}>
            بانتظار الصياغة ←
          </span>
        </button>

        {/* Bento Interactive Tile 3: تم النشر */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('published')}
          className={`col-span-1 p-3.5 rounded-[28px] text-right flex flex-col justify-between transition-all cursor-pointer select-none border group ${
            selectedStatusFilter === 'published'
              ? 'bg-[#46523B] text-white border-[#A08D52] shadow-md ring-2 ring-[#A08D52]/30'
              : 'bg-white text-slate-700 border-[#46523B]/10 shadow-[0_4px_16px_rgba(70,82,59,0.03)] hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${selectedStatusFilter === 'published' ? 'text-emerald-200' : 'text-slate-500'}`}>
              تم النشر في 𝕏
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${selectedStatusFilter === 'published' ? 'bg-white/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${selectedStatusFilter === 'published' ? 'text-white' : 'text-emerald-700'}`}>
            {publishedPr}
          </div>
          <span className={`text-[10px] mt-1 ${selectedStatusFilter === 'published' ? 'text-emerald-200' : 'text-slate-400'}`}>
            تغطية مكتملة ←
          </span>
        </button>
      </div>

      {/* Top Segmented Tabs: Status Filter */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('all')}
          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedStatusFilter === 'all'
              ? 'bg-[#46523B] text-[#C4B688] shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>الكل</span>
          <span className="text-[10px] font-mono">({totalPr})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusFilter('pending')}
          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedStatusFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>قيد التجهيز</span>
          <span className="text-[10px] font-mono">({pendingPr})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusFilter('published')}
          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedStatusFilter === 'published'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>تم النشر</span>
          <span className="text-[10px] font-mono">({publishedPr})</span>
        </button>
      </div>

      {/* Workflow Explanatory Notice */}
      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-right flex items-start gap-2.5 text-xs">
        <Radio className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-[11px] text-emerald-950 leading-relaxed">
          <strong className="text-[#46523B]">المسار الآلي المعتمد:</strong> عند تفعيل خيار «النشر في حساب الكلية منصة إكس» أثناء الاعتماد النهائي، يتم إرسال نسخة آلية لهذه اللوحة لتجهيز التغريدة وتوثيق تاريخ النشر.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالنشاط، المقدم، أو الوحدة..."
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#A08D52] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
        </div>

        {activityTypes.length > 0 && (
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">كافة أنواع الأنشطة</option>
            {activityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Activity Cards List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 mb-1">
            لا توجد أنشطة محالة للعلاقات العامة حالياً
          </h3>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            ستظهر الأنشطة هنا فور تفعيل خيار «النشر في منصة إكس» من قبل مدقق المنظومة.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((req) => {
            const currentDraft =
              editingDrafts[req.id] !== undefined
                ? editingDrafts[req.id]
                : req.prTweetDraft || generateDefaultTweet(req);

            const isPublished = req.prStatus === 'published_pr';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border transition-all duration-150 overflow-hidden shadow-xs hover:border-slate-300 ${
                  isPublished
                    ? 'border-emerald-200/90 bg-gradient-to-b from-emerald-50/15 to-white'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Top Banner */}
                <div className="p-3 sm:p-4 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      #{req.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {req.type}
                      </span>
                      <MediaPublishBadge request={req} />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-[#46523B] leading-snug">
                    {req.name}
                  </h3>
                </div>

                {/* Card Info Grid (2 columns) */}
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-[#46523B] shrink-0" />
                      <span className="text-slate-700 truncate">{req.presenter}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#46523B] shrink-0" />
                      <span className="text-slate-700 truncate">{req.branch}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#46523B] shrink-0" />
                      <span className="text-slate-600 font-mono text-[10px]">
                        {req.startDate} ({req.startTime})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#46523B] shrink-0" />
                      <span className="text-slate-600 text-[10px] truncate">
                        {req.deliveryMode} ({req.hours} س)
                      </span>
                    </div>
                  </div>

                  {/* Tweet Draft Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="font-mono text-xs">𝕏</span>
                        <span>صياغة التغريدة الرسمية</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTweet(req.id, currentDraft)}
                        className="text-[10px] font-bold text-[#46523B] bg-white border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        {copiedId === req.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>نسخ التغريدة</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={currentDraft}
                      onChange={(e) =>
                        setEditingDrafts({
                          ...editingDrafts,
                          [req.id]: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:border-[#A08D52] outline-none font-sans leading-relaxed"
                    />

                    {/* PR Coverage URL & Note */}
                    <div className="space-y-1.5 pt-1">
                      <div className="relative">
                        <input
                          type="url"
                          value={
                            editingUrls[req.id] !== undefined
                              ? editingUrls[req.id]
                              : req.prCoverageUrl || ''
                          }
                          onChange={(e) =>
                            setEditingUrls({
                              ...editingUrls,
                              [req.id]: e.target.value,
                            })
                          }
                          placeholder="رابط التغريدة المنشورة أو إثبات التغطية في منصة X (URL)..."
                          className="w-full text-[11px] px-2.5 py-1.5 pl-8 rounded-lg border border-slate-200 bg-white focus:border-[#A08D52] outline-none font-sans"
                        />
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={
                            editingNotes[req.id] !== undefined
                              ? editingNotes[req.id]
                              : req.prNotes || ''
                          }
                          onChange={(e) =>
                            setEditingNotes({
                              ...editingNotes,
                              [req.id]: e.target.value,
                            })
                          }
                          placeholder="ملاحظات إضافية حول التغطية الإعلامية (اختياري)..."
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:border-[#A08D52] outline-none font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveRequestForDetails(req)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة الاستمارة والتاريخ الإداري</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveDraft(req)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        حفظ المسودة
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePublishToggle(req)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs ${
                          isPublished
                            ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                            : 'bg-[#46523B] text-[#C4B688] hover:bg-[#384230]'
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>إرجاع كـ قيد التجهيز</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تأكيد النشر في X</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {activeRequestForDetails && (
        <RequestDetailsModal
          request={activeRequestForDetails}
          isOpen={!!activeRequestForDetails}
          onClose={() => setActiveRequestForDetails(null)}
          viewerRole="pr"
        />
      )}
    </div>
  );
};
