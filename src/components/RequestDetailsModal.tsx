import React, { useState } from 'react';
import { ActivityRequest, UserRole } from '../types';
import { StatusBadge } from './StatusBadge';
import { MediaPublishBadge } from './MediaPublishBadge';
import { AttendancePreviewModal } from './AttendancePreviewModal';
import { downloadAttendanceSheet } from '../utils/activityUtils';
import {
  X,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Building2,
  Users,
  UserCheck,
  Tag,
  FileCheck2,
  ExternalLink,
  History,
  CheckCircle2,
  ShieldCheck,
  CloudUpload,
  AlertTriangle,
  Share2,
  Award,
  Sparkles,
  Download,
  Eye,
  Edit3,
  Ban,
  Link2,
} from 'lucide-react';

interface Props {
  request: ActivityRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onEditRequest?: (req: ActivityRequest) => void;
  viewerRole?: UserRole;
}

export const RequestDetailsModal: React.FC<Props> = ({
  request,
  isOpen,
  onClose,
  onEditRequest,
  viewerRole,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen || !request) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col overflow-hidden text-right font-['Tajawal',sans-serif] animate-fade-slide-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#46523B] via-[#384230] to-[#2A3324] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#A08D52]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#A08D52]/25 border border-[#A08D52]/50 flex items-center justify-center text-[#C4B688] shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold leading-tight">تفاصيل استمارة النشاط المعتمدة</h3>
              <p className="text-[10px] text-emerald-200/90">
                طلب رقم: #{request.id} • منصة ارتقاء
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {/* Status & Title Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#46523B]/10 text-[#46523B] border border-[#46523B]/20">
                {request.type}
              </span>
              <StatusBadge status={request.status} note={request.note} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {request.name}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              مقدم النشاط: <span className="font-semibold text-slate-700">{request.presenter}</span>
            </p>

            {request.status === 'returned_emp' && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>ملاحظة وتوجيه المدير المباشر:</span>
                  </div>
                  <span className="text-[9px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                    مطلوب التعديل
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 bg-white/90 p-2.5 rounded-lg border border-rose-100 leading-relaxed">
                  "{request.note || 'يرجى استيفاء وتعديل بيانات الاستمارة وفق التوجيهات.'}"
                </p>
              </div>
            )}
          </div>

          {/* Group 1: Basic Info & Units */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
              <Building2 className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>1. البيانات الأساسية والوحدة المشرفة</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">الوحدة المشرفة:</span>
                <span className="font-semibold text-slate-800">{request.unit || 'وحدة شؤون الطلاب'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الفرع:</span>
                <span className="font-semibold text-slate-800">{request.branch || 'فرع الزلفي - شطر الطلاب'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">منسق النشاط:</span>
                <span className="font-semibold text-slate-800">{request.coordinatorName || request.presenter}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تصنيف النشاط:</span>
                <span className="font-semibold text-slate-800">{request.type}</span>
              </div>
            </div>
          </div>

          {/* Group 2: Schedule & Timing */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
              <Calendar className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>2. التوقيت والمواعيد والساعات</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/70 p-2.5 rounded-xl text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ البداية:</span>
                <span className="font-semibold text-slate-800">{request.startDate || request.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ النهاية:</span>
                <span className="font-semibold text-slate-800">{request.endDate || request.startDate || request.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">وقت البداية:</span>
                <span className="font-semibold text-slate-800">{request.startTime || '10:00 ص'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الساعات التدريبية:</span>
                <span className="font-bold text-[#46523B]">{request.hours} ساعات</span>
              </div>
            </div>
          </div>

          {/* Group 3: Audience & Delivery Mode */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
              <Users className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>3. المستهدفين وحالة التنفيذ</span>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl text-[11px] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">الفئة المستهدفة:</span>
                  <span className="font-semibold text-slate-800">{request.targetAudience || 'الطلاب والطالبات'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">النوع / الجنس:</span>
                  <span className="font-semibold text-slate-800">{request.targetGender || 'الجنسين (ذكر وأنثى)'}</span>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="text-slate-400 block text-[10px]">حالة النشاط ومقره:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-md ${
                    request.deliveryMode === 'عن بعد'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {request.deliveryMode === 'عن بعد' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {request.deliveryMode || 'عن بعد'}
                  </span>
                  <span className="font-medium text-slate-700">
                    {request.deliveryMode === 'عن بعد'
                      ? (request.meetingUrl ? (
                          <a
                            href={request.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:underline flex items-center gap-1 text-[10px]"
                          >
                            <span>{request.meetingUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : 'رابط الجلسة الافتراضية (Blackboard)')
                      : (request.physicalLocation || request.location || 'مدرج الكلية التطبيقية')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Administrative & Summary */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>4. الموافقات والارتباطات الإدارية وملخص النشاط</span>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl text-[11px] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">مركز التعاون والشراكات:</span>
                  <span className="font-semibold text-slate-800">{request.partnershipApproval || 'لا تحتاج إلى موافقة'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">رقم المعاملة (الاتصالات الإدارية):</span>
                  <span className="font-semibold text-slate-800">{request.transactionNumber || 'غير محدد / غير مطلوب'}</span>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="text-slate-400 block text-[10px]">ملخص النشاط والأهداف:</span>
                <p className="mt-1 text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                  {request.summary || 'استيفاء متطلبات خطة الأنشطة المعتمدة وتوثيق ساعات الطلاب في منصة ارتقاء'}
                </p>
              </div>
            </div>
          </div>

          {/* Group: Administrative Dispatch & Directives (إن وجدت) */}
          {(request.deanApproved || request.assignedUploader || request.uploaderInstructions) && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
                <Award className="w-3.5 h-3.5 text-[#A08D52]" />
                <span>مسار الاعتماد الإداري والتوجيه التنفيذي</span>
              </div>
              <div className="bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 p-2.5 rounded-xl text-[11px] space-y-2 border border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">اعتماد رئيس الكلية:</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>معتمد رسمياً {request.deanApprovalDate ? `(${request.deanApprovalDate})` : ''}</span>
                    </span>
                  </div>

                  {request.assignedUploader && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">الموظف المكلف بالرفع:</span>
                      <span className="font-semibold text-slate-800">{request.assignedUploader}</span>
                    </div>
                  )}

                  {request.xPlatformPublish !== undefined && viewerRole !== 'auditor' && viewerRole !== 'accreditation' && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">النشر في منصة X:</span>
                      <span className={request.xPlatformPublish ? 'font-bold text-slate-900' : 'text-slate-500'}>
                        {request.xPlatformPublish ? 'مطلوب إعلان رسمي في حساب الكلية' : 'بدون إعلان (سجل مهاري فقط)'}
                      </span>
                    </div>
                  )}
                </div>

                {request.uploaderInstructions && (
                  <div className="border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-500 block text-[10px] font-bold">توجيهات وتعليمات التدقيق:</span>
                    <p className="mt-0.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      {request.uploaderInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Group: Media Coverage & PR Publication (وحدة العلاقات العامة والإعلام) - مستبعد تماماً من لوحة المدقق/الاعتماد */}
          {viewerRole !== 'auditor' && viewerRole !== 'accreditation' && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
                  <Share2 className="w-3.5 h-3.5 text-[#A08D52]" />
                  <span>التغطية والنشر الإعلامي (وحدة العلاقات العامة والإعلام)</span>
                </div>
                <MediaPublishBadge request={request} />
              </div>

              {request.xPlatformPublish ? (
                <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2.5 text-xs">
                  {request.prStatus === 'published_pr' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 p-2.5 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-[11px]">
                            تم توثيق ونشر التغطية الإعلامية في حساب الكلية الرسمي بمنصة X
                          </span>
                        </div>
                        {request.prPublishedAt && (
                          <span className="text-[10px] text-emerald-800 font-mono">
                            {request.prPublishedAt.includes('T')
                              ? new Date(request.prPublishedAt).toLocaleDateString('ar-SA')
                              : request.prPublishedAt}
                          </span>
                        )}
                      </div>

                      {/* Direct link / Proof of Coverage */}
                      {(request.prCoverageUrl || (request.prNotes && request.prNotes.startsWith('http'))) && (
                        <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 truncate">
                            <Globe className="w-4 h-4 text-[#46523B] shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">
                                رابط إثبات التغطية والتغريدة الرسمية
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono truncate block max-w-[220px] sm:max-w-xs">
                                {request.prCoverageUrl || request.prNotes}
                              </span>
                            </div>
                          </div>
                          <a
                            href={request.prCoverageUrl || request.prNotes}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#46523B] text-[#C4B688] hover:bg-[#384230] rounded-xl text-xs font-bold active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
                          >
                            <span>مشاهدة التغريدة</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {/* Tweet Text Published */}
                      {request.prTweetDraft && (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 block mb-1">
                            نص التغريدة والمادة الإعلامية:
                          </span>
                          <p className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {request.prTweetDraft}
                          </p>
                        </div>
                      )}

                      {/* PR Notes if any */}
                      {request.prNotes && !request.prNotes.startsWith('http') && (
                        <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200">
                          <strong className="text-slate-800 block mb-0.5 text-[10px]">ملاحظات العلاقات العامة:</strong>
                          <p>{request.prNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        المعاملة تتطلب إعلاناً رسمياً في منصة X • التغطية قيد التجهيز والنشر حالياً من قِبل وحدة العلاقات العامة والإعلام.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200 text-[11px] text-rose-800 flex items-center gap-2">
                  <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>
                    هذا النشاط غير مدرج للنشر الإعلامي في منصة X (سجل مهاري فقط).
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Group: Attendance Sheet (مرحلة كشف الحضور الختامية) */}
          {request.attendanceSheet && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#A08D52]" />
                  <span>مرحلة كشف الحضور الختامية (منصة ارتقاء)</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    request.attendanceSheet.status === 'approved' || request.isOfficiallyClosed
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : request.attendanceSheet.status === 'returned'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {request.attendanceSheet.status === 'approved' || request.isOfficiallyClosed
                    ? 'كشف معتمد ومغلق رسمياً'
                    : request.attendanceSheet.status === 'returned'
                    ? 'مطلوب التعديل'
                    : 'قيد المراجعة والاعتماد'}
                </span>
              </div>

              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">{request.attendanceSheet.fileName}</span>
                      <span className="text-[10px] text-slate-500">
                        {request.attendanceSheet.fileSize || '1.2 MB'} • عدد الحضور: {request.attendanceSheet.attendeesCount || 35} حاضر
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#46523B] text-[#C4B688] rounded-xl text-[10px] font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>معاينة الكشف</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadAttendanceSheet(request)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>

                {request.attendanceSheet.status === 'returned' && request.attendanceSheet.returnNote && (
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-rose-900 text-[10px]">
                    <strong>ملاحظات التعديل من مسؤول الرفع: </strong>
                    <span>{request.attendanceSheet.returnNote}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Group 5: Administrative Lifecycle & Audit Trail */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46523B]">
              <History className="w-3.5 h-3.5 text-[#A08D52]" />
              <span>5. السجل والتاريخ الإداري لسير المعاملة</span>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl text-[11px] space-y-2.5 border border-slate-200/70">
              {/* Milestone 1: Submitter */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">1. تقديم الاستمارة الرسمية</span>
                    <span className="text-[10px] text-slate-500">{request.startDate || request.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    تم رفع الاستمارة بواسطة: {request.presenter} ({request.unit || 'الكلية التطبيقية'})
                  </p>
                </div>
              </div>

              {/* Milestone 2: Direct Manager */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'pending_manager' || request.status === 'returned_manager'
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200'
                      : request.status === 'returned_emp' || request.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#46523B] text-[#C4B688]'
                  }`}
                >
                  {request.status === 'pending_manager' || request.status === 'returned_manager' ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : request.status === 'returned_emp' || request.status === 'rejected' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">2. مراجعة واعتماد المدير المباشر</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'pending_manager'
                        ? 'قيد الانتظار'
                        : request.status === 'returned_emp'
                        ? 'مُسترجع للموظف'
                        : 'معتمد'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'pending_manager'
                      ? 'الطلب بانتظار إجراء المدير المباشر للبرامج والتدريب.'
                      : request.status === 'returned_emp'
                      ? `تم الإرجاع بملاحظة: "${request.note}"`
                      : 'تمت مراجعة ملاءمة النشاط واعتماده بنجاح وإحالته لقسم التدقيق.'}
                  </p>
                </div>
              </div>

              {/* Milestone 3: Auditor & Dean */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'pending_auditor'
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200 animate-pulse'
                      : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">3. التدقيق والاعتماد النهائي (رئيس الكلية)</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'pending_auditor'
                        ? 'قيد التدقيق'
                        : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                        ? 'معتمد نهائياً'
                        : 'مرحلة لاحقة'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'pending_auditor'
                      ? 'المعاملة قيد مراجعة الضوابط والشراكات من قِبل مسؤول التدقيق.'
                      : request.status === 'approved_final' || request.status === 'uploaded_irtqaa'
                      ? 'تم التحقق من الضوابط الأكاديمية واعتماد ساعات النشاط رسمياً.'
                      : 'تتطلب موافقة المدير المباشر أولاً.'}
                  </p>
                </div>
              </div>

              {/* Milestone 4: Irtqaa Upload */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.status === 'uploaded_irtqaa'
                      ? 'bg-[#46523B] text-[#C4B688] ring-2 ring-[#A08D52]'
                      : request.status === 'approved_final'
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">4. الرفع إلى منصة ارتقاء الرسمية</span>
                    <span className="text-[10px] text-slate-500">
                      {request.status === 'uploaded_irtqaa'
                        ? 'مكتمل ومرفوع'
                        : request.status === 'approved_final'
                        ? 'جاهز للرفع'
                        : 'قيد الإجراء'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.status === 'uploaded_irtqaa'
                      ? 'تمت المزامنة بنجاح في السجل المهاري للطلاب على منصة ارتقاء.'
                      : request.status === 'approved_final'
                      ? 'الطلب جاهز لدى مسؤول المنصة للرفع الفوري.'
                      : 'في انتظار اكتمال الموافقات السابقة.'}
                  </p>
                </div>
              </div>

              {/* Milestone 5: Attendance Sheet (مرحلة كشف الحضور الختامية - الخطوة الأخيرة) */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    request.attendanceSheet?.status === 'approved' || request.isOfficiallyClosed
                      ? 'bg-[#46523B] text-[#C4B688] ring-2 ring-[#A08D52]'
                      : request.attendanceSheet?.status === 'pending_review'
                      ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                      : request.status === 'uploaded_irtqaa'
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">5. كشف الحضور والتوثيق الختامي (الخطوة الأخيرة)</span>
                    <span className="text-[10px] text-slate-500">
                      {request.attendanceSheet?.status === 'approved' || request.isOfficiallyClosed
                        ? 'معتمد ومغلق رسمياً'
                        : request.attendanceSheet?.status === 'pending_review'
                        ? 'قيد مراجعة الكشف'
                        : request.attendanceSheet?.status === 'returned'
                        ? 'مطلوب تعديل الكشف'
                        : request.status === 'uploaded_irtqaa'
                        ? 'بانتظار رفع الكشف'
                        : 'المرحلة الختامية'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {request.attendanceSheet?.status === 'approved' || request.isOfficiallyClosed
                      ? `تم اعتماد كشف الحضور رسمياً (${request.attendanceSheet?.attendeesCount || ''} حاضر) وتوثيق الساعات بالسجل المهاري.`
                      : request.attendanceSheet?.status === 'pending_review'
                      ? 'تم رفع كشف الحضور من قِبل مقدم النشاط وقيد تدقيق مسؤول منصة ارتقاء.'
                      : request.attendanceSheet?.status === 'returned'
                      ? `تمت إعادة الكشف للموظف للتعديل: "${request.attendanceSheet.returnNote || ''}"`
                      : request.status === 'uploaded_irtqaa'
                      ? 'فور انتهاء فعاليات النشاط، يرفع الموظف كشف الحضور المعتمد لإغلاق المعاملة رسمياً.'
                      : 'تتفعل هذه المرحلة الختامية فور انتهاء النشاط ورفع كشف الحضور المعتمد.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
          {request.status === 'returned_emp' && onEditRequest ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditRequest(request);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#46523B] via-[#384230] to-[#2A3324] text-[#C4B688] hover:text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#A08D52]/40"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C4B688]" />
              <span>تعديل بيانات الاستمارة</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black active:scale-95 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>

      {/* Preview Attendance Sheet Modal */}
      <AttendancePreviewModal
        isOpen={isPreviewOpen}
        request={request}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
