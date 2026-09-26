import React, { useState } from 'react';
import { ActivityRequest } from '../types';
import { RequestDetailsModal } from './RequestDetailsModal';
import {
  Share2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Calendar,
  Building2,
  Users,
  MapPin,
  Sparkles,
  Megaphone,
  ArrowRight,
  Send,
  AlertCircle,
  FileText,
  Radio,
  BookmarkCheck
} from 'lucide-react';

interface Props {
  requests: ActivityRequest[];
  onUpdatePrStatus: (
    requestId: number,
    prStatus: 'pending_pr' | 'published_pr',
    tweetDraft?: string,
    prNotes?: string
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

  // Per-card editing drafts and copied feedback
  const [editingDrafts, setEditingDrafts] = useState<Record<number, string>>({});
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter activities sent to PR (where xPlatformPublish is true)
  const prActivities = requests.filter((r) => r.xPlatformPublish === true);

  const totalPr = prActivities.length;
  const pendingPr = prActivities.filter((r) => r.prStatus !== 'published_pr').length;
  const publishedPr = prActivities.filter((r) => r.prStatus === 'published_pr').length;
  const completionRate = totalPr > 0 ? Math.round((publishedPr / totalPr) * 100) : 100;

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
    const draft = editingDrafts[req.id] || req.prTweetDraft || generateDefaultTweet(req);
    const note = editingNotes[req.id] !== undefined ? editingNotes[req.id] : (req.prNotes || '');
    onUpdatePrStatus(req.id, newStatus, draft, note);
  };

  const handleSaveDraft = (req: ActivityRequest) => {
    const draft = editingDrafts[req.id] || req.prTweetDraft || generateDefaultTweet(req);
    const note = editingNotes[req.id] !== undefined ? editingNotes[req.id] : (req.prNotes || '');
    onUpdatePrStatus(req.id, req.prStatus || 'pending_pr', draft, note);
  };

  const activityTypes = Array.from(new Set(prActivities.map((r) => r.type)));

  return (
    <div className="space-y-6 animate-fade-slide-up text-right font-['Tajawal',sans-serif]">
      {/* Admin Preview Header Banner (When accessed via Quick Access from Admin) */}
      {isAdminViewing && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] border border-[#c59b27]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-[#e6c566]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#c59b27]/20 text-[#e6c566] border border-[#c59b27]/30">
                  إشراف مدير النظام المركزي
                </span>
                <h4 className="text-sm font-extrabold text-white">
                  وضع المعاينة الإدارية الفورية - وحدة العلاقات العامة والإعلام
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                يمكنك الاطلاع على الأنشطة المحالة آلياً للنشر في منصة X، التحقق من جودة الصياغة ومتابعة سير الإعلانات.
              </p>
            </div>
          </div>
          {onReturnToAdmin && (
            <button
              type="button"
              onClick={onReturnToAdmin}
              className="px-4 py-2 rounded-xl bg-[#e6c566] hover:bg-[#d4b355] text-[#1b4332] text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>العودة للوحة مدير النظام</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      )}

      {/* Main Page Title Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#081c15] text-[#e6c566] flex items-center justify-center shadow-md shadow-[#1b4332]/25 border border-[#c59b27]/30">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono flex items-center gap-1">
                  <span>منصة X</span>
                  <span>𝕏</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ربط وتوثيق إعلامي مباشر
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1b4332] tracking-tight mt-1">
                لوحة تحكم العلاقات العامة والإعلام المؤسسي
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                استقبال النسخ الآلية للأنشطة المعتمدة نهائياً، تجهيز التغريدات الرسمية، وتوثيق النشر في حساب الكلية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] font-bold text-slate-400 block">الحساب الرسمي المعتمد</span>
              <span className="text-xs font-black text-[#1b4332] font-mono dir-ltr inline-block">
                @AppliedCollege_MU
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">الأنشطة المحالة للنشر</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalPr}</div>
          <p className="text-[10px] text-slate-400 mt-1">نسخ آلية استقبلت من مدقق المنظومة</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">بانتظار الصياغة والنشر</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{pendingPr}</div>
          <p className="text-[10px] text-slate-400 mt-1">تتطلب مراجعة أو تغريدة في منصة X</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">تم النشر في منصة X</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{publishedPr}</div>
          <p className="text-[10px] text-slate-400 mt-1">تمت التغطية الإعلامية بنجاح</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">نسبة الإنجاز الإعلامي</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b4332] mt-2">{completionRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#1b4332] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Workflow Explanatory Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-right flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="text-xs text-emerald-950 leading-relaxed">
          <span className="font-bold">المسار الآلي المعتمد:</span> عند قيام مدقق المنظومة والاعتماد بتفعيل خيار{' '}
          <span className="font-bold text-[#1b4332] underline">«النشر والإعلان الرسمي في حساب الكلية منصة إكس»</span> أثناء الاعتماد النهائي، يتم إرسال نسخة إلكترونية آلية وفورية إلى هذه الصفحة تتضمن كافة تفاصيل النشاط والملخص والأهداف لإعداد المواد والتغريدات وتوثيق تاريخ النشر.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالنشاط، المقدم، أو الوحدة..."
            className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/80 focus:bg-white focus:border-[#c59b27] outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatusFilter === 'all'
                  ? 'bg-white text-[#1b4332] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              الكل ({totalPr})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatusFilter === 'pending'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              قيد التجهيز ({pendingPr})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatusFilter === 'published'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              تم النشر ({publishedPr})
            </button>
          </div>

          {/* Type Filter */}
          {activityTypes.length > 0 && (
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-[#c59b27] outline-none cursor-pointer"
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
      </div>

      {/* Activity Cards List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 mb-1">
            لا توجد أنشطة محالة للعلاقات العامة حالياً
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            عند قيام مسؤول التدقيق والاعتماد بتفعيل زر «النشر والإعلان الرسمي في حساب الكلية منصة إكس» قبل الاعتماد النهائي، ستظهر نسخ الأنشطة هنا فوراً.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((req) => {
            const currentDraft =
              editingDrafts[req.id] !== undefined
                ? editingDrafts[req.id]
                : req.prTweetDraft || generateDefaultTweet(req);

            const isPublished = req.prStatus === 'published_pr';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isPublished
                    ? 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/20 to-white'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Top Banner */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]"></span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {req.type}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>معتمد نهائياً</span>
                        </span>
                        {isPublished ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3" />
                            <span>تم النشر في منصة X</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>بانتظار التغريد والنشر</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#1b4332] mt-1">
                        {req.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveRequestForDetails(req)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة الاستمارة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePublishToggle(req)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs ${
                        isPublished
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                          <span>تحديد كـ تم النشر في X</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Main Info Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Metadata details (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>مقدم النشاط:</span>
                        </span>
                        <span className="font-bold text-slate-900">{req.presenter}</span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>الوحدة المشرفة:</span>
                        </span>
                        <span className="font-bold text-slate-900">{req.unit}</span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>تاريخ ووقت التنفيذ:</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {req.startDate} ({req.startTime})
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>نمط ومقر التنفيذ:</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {req.deliveryMode === 'عن بعد' ? 'عن بعد (افتراضي)' : req.physicalLocation || req.branch}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>الساعات والفئة:</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {req.hours} ساعات | {req.targetAudience}
                        </span>
                      </div>
                    </div>

                    {req.summary && (
                      <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60">
                        <span className="text-[10px] font-bold text-amber-900 block mb-0.5">
                          ملخص ومستهدفات النشاط:
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                          {req.summary}
                        </p>
                      </div>
                    )}

                    {req.prSentAt && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Send className="w-3 h-3 text-[#1b4332]" />
                        <span>أُرسلت النسخة الآلية: {new Date(req.prSentAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Tweet Formulation & Publishing Suite (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                          <span className="text-xs font-bold text-slate-900">
                            صياغة التغريدة الرسمية (مسودة النشر في منصة X)
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {currentDraft.length} حرف
                        </span>
                      </div>

                      <textarea
                        rows={6}
                        value={currentDraft}
                        onChange={(e) =>
                          setEditingDrafts({ ...editingDrafts, [req.id]: e.target.value })
                        }
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#1b4332] outline-none transition font-sans leading-relaxed resize-none"
                        placeholder="اكتب أو عدل نص التغريدة الرسمية هنا..."
                      ></textarea>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyTweet(req.id, currentDraft)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs ${
                            copiedId === req.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {copiedId === req.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تم النسخ بنجاح!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>نسخ نص التغريدة</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentDraft)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          <span>فتح ونشر في منصة X</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveDraft(req)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1b4332] hover:bg-[#1b4332]/10 transition active:scale-95 cursor-pointer"
                      >
                        حفظ التعديلات
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
          onClose={() => setActiveRequestForDetails(null)}
        />
      )}
    </div>
  );
};
