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
}

export const PRDashboardView: React.FC<Props> = ({
  requests,
  onUpdatePrStatus,
  isAdminViewing,
  onReturnToAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'published'>('all');
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
      {/* Title Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#1b4332] via-[#c59b27] to-[#1b4332]" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center shrink-0 border border-[#1b4332]/20">
            <Share2 className="w-5 h-5 text-[#c59b27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-900 border border-sky-200">
                العلاقات العامة
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#1b4332]">
                إعداد وتوثيق النشر في حساب الكلية بمنصة X
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              صياغة التغريدات الرسمية للأنشطة المعتمدة وتوثيق الروابط والتغطية الإعلامية
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-slate-900 text-white font-bold px-2.5 py-1 rounded-full font-mono flex items-center gap-1 shrink-0 self-start sm:self-center">
          <span>𝕏</span>
          <span>@AppliedCollege_MU</span>
        </span>
      </div>

      {/* Admin Quick Access Bar (If opened from admin view) */}
      {isAdminViewing && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#1b4332] to-[#081c15] text-[#e6c566] border border-[#c59b27]/40 shadow-xs flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Megaphone className="w-4 h-4 text-[#e6c566] shrink-0" />
            <span className="font-bold truncate text-[11px]">معاينة إدارية لوحدة العلاقات العامة</span>
          </div>
          {onReturnToAdmin && (
            <button
              type="button"
              onClick={onReturnToAdmin}
              className="px-2.5 py-1 rounded-lg bg-[#e6c566] text-[#1b4332] text-[10px] font-black flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span>لوحة المدير</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          )}
        </div>
      )}

      {/* Unified 4-Card KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">المحالة للنشر</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalPr}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">نسخ آلية معتمدة</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">قيد التجهيز</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{pendingPr}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">بانتظار الصياغة والتغريد</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">تم النشر في X</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{publishedPr}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">تغطية إعلامية مكتملة</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">نسبة الإنجاز</span>
            <div className="w-7 h-7 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1b4332] mt-1">{completionRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">معدل التغطية الإعلامية</div>
        </div>
      </div>

      {/* Top Segmented Tabs: Status Filter */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('all')}
          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedStatusFilter === 'all'
              ? 'bg-[#1b4332] text-[#e6c566] shadow-sm'
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
          <strong className="text-[#1b4332]">المسار الآلي المعتمد:</strong> عند تفعيل خيار «النشر في حساب الكلية منصة إكس» أثناء الاعتماد النهائي، يتم إرسال نسخة آلية لهذه اللوحة لتجهيز التغريدة وتوثيق تاريخ النشر.
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
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none"
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

                  <h3 className="text-xs sm:text-sm font-extrabold text-[#1b4332] leading-snug">
                    {req.name}
                  </h3>
                </div>

                {/* Card Info Grid (2 columns) */}
                <div className="p-3 sm:p-4 space-y-3">
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
                        {req.startDate} ({req.startTime})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1b4332] shrink-0" />
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
                        className="text-[10px] font-bold text-[#1b4332] bg-white border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 flex items-center gap-1 cursor-pointer active:scale-95"
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
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-sans leading-relaxed"
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
                          className="w-full text-[11px] px-2.5 py-1.5 pl-8 rounded-lg border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-sans"
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
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:border-[#c59b27] outline-none font-sans"
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
                            : 'bg-[#1b4332] text-[#e6c566] hover:bg-[#143728]'
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
