import React, { useState } from 'react';
import { ActivityRequest, AccreditationDocument } from '../types';
import { generateAccreditationSampleImage } from '../utils/activityUtils';
import {
  X,
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileImage,
  Sparkles,
  ShieldCheck,
  Calendar,
  Building2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  request: ActivityRequest | null;
  onClose: () => void;
  onConfirm: (requestId: number, document: AccreditationDocument) => void;
  uploaderName?: string;
}

export const IrtqaaAccreditationModal: React.FC<Props> = ({
  isOpen,
  request,
  onClose,
  onConfirm,
  uploaderName = 'ناصر العصيمي',
}) => {
  if (!isOpen || !request) return null;

  const [accreditationNumber, setAccreditationNumber] = useState<string>(
    `IRTQ-2026-${request.id}`
  );
  const [notes, setNotes] = useState<string>(
    'تمت مواءمة وتوثيق ساعات النشاط واعتماد النموذج المطبوع والمختوم عبر منصة ارتقاء الجامعية.'
  );
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    url?: string;
    isMock?: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Generate an official sample scanned university certificate / accreditation sheet
  const handleUseSampleDocument = () => {
    const sampleUrl = generateAccreditationSampleImage(
      request.name,
      accreditationNumber || `IRTQ-2026-${request.id}`,
      uploaderName,
      request.hours,
      request.startDate || request.date,
      request.branch
    );
    setSelectedFile({
      name: `صورة_نموذج_اعتماد_ارتقاء_${request.name.replace(/\s+/g, '_')}_مطبوع.svg`,
      size: '2.1 MB',
      url: sampleUrl,
      isMock: false,
    });
    setErrorMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (image or pdf)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('يرجى اختيار ملف صورة (JPG, PNG) أو مستند PDF فقط.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: result,
        isMock: false,
      });
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('إرفاق صورة أو نسخة نموذج الاعتماد المطبوع من منصة ارتقاء إلزامي لإتمام المزامنة.');
      return;
    }

    setIsSubmitting(true);

    const doc: AccreditationDocument = {
      id: `acc-${Date.now()}`,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileUrl: selectedFile.url,
      uploadedAt: new Date().toISOString(),
      uploadedBy: uploaderName,
      accreditationNumber: accreditationNumber.trim() || `IRTQ-${request.id}`,
      notes: notes.trim(),
    };

    setTimeout(() => {
      onConfirm(request.id, doc);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-['Tajawal',sans-serif]">
      <div
        dir="rtl"
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[92vh] overflow-y-auto flex flex-col text-right animate-scale-up"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#1b4332] via-[#143728] to-[#081c15] text-white p-4 sm:p-5 rounded-t-3xl relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#c59b27]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c59b27] to-[#e6c566] text-[#081c15] flex items-center justify-center font-bold shadow-md shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  إرفاق وتوثيق نموذج الاعتماد المطبوع (منصة ارتقاء)
                </h3>
                <p className="text-[11px] text-emerald-200/90 mt-0.5">
                  الربط التلقائي والإرسال لصفحة الاعتمادات (أ. بيان الطيار)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1">
          {/* Mandatory Requirement Alert */}
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-right">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-relaxed">
              <strong className="font-bold block text-amber-950">
                شرط إلزامي للمزامنة والأرشفة المؤسسية:
              </strong>
              يُلزم النظام الموظف بإرفاق صورة أو نسخة نموذج الاعتماد المطبوع من منصة ارتقاء بالجامعة. فور التأكيد، تُرسل النسخة تلقائياً وتظهر مباشرة في صفحة الاعتمادات (بيان الطيار) كأرشيف معتمد ومكتمل.
            </div>
          </div>

          {/* Activity Mini Card */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="bg-[#1b4332] text-white px-2 py-0.5 rounded-md text-[10px] font-mono">
                  #{request.id}
                </span>
                <span>{request.name}</span>
              </span>
              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {request.type}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="truncate">{request.branch || 'المقر الرئيسي'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{request.hours} ساعات معتمدة</span>
              </div>
              <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{request.startDate || request.date}</span>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              نسخة نموذج الاعتماد المطبوع من منصة ارتقاء <span className="text-rose-600">*</span>
            </label>

            {/* Upload Dropzone */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-[#1b4332] rounded-2xl p-4 sm:p-5 text-center bg-slate-50/60 hover:bg-slate-50 transition-all group">
              <input
                type="file"
                id="accreditation-file-input"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {!selectedFile ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-[#1b4332]" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    اسحب وأفلت صورة النموذج هنا أو اضغط للاستعراض
                  </div>
                  <p className="text-[10px] text-slate-500">
                    يدعم ملفات الصور (JPG, PNG) أو مستند PDF (الحد الأقصى 15 ميجابايت)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-300 shadow-xs z-20 relative">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      {selectedFile.name.endsWith('.pdf') ? (
                        <FileText className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <FileImage className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                        {selectedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{selectedFile.size}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> جاهز للإرسال
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Live Image Preview */}
              {selectedFile?.url && (
                <div className="mt-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs text-right">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    معاينة صورة النموذج المرفقة:
                  </span>
                  <div className="flex justify-center bg-slate-50 p-2 rounded-lg border border-slate-100 max-h-56 overflow-hidden">
                    <img
                      src={selectedFile.url}
                      alt="معاينة نموذج الاعتماد المرفق"
                      className="max-h-52 w-auto object-contain rounded shadow-2xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test / Preset Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">للتجربة السريعة:</span>
              <button
                type="button"
                onClick={handleUseSampleDocument}
                className="text-[11px] font-bold text-[#1b4332] hover:text-[#c59b27] bg-[#1b4332]/5 hover:bg-[#1b4332]/10 px-2.5 py-1 rounded-lg border border-[#1b4332]/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>إرفاق نموذج ارتقاء المعتمد (النموذج الرسمي)</span>
              </button>
            </div>
          </div>

          {/* Accreditation Number and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الاعتماد بمنصة ارتقاء
              </label>
              <input
                type="text"
                value={accreditationNumber}
                onChange={(e) => setAccreditationNumber(e.target.value)}
                placeholder="مثال: IRTQ-2026-104"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                مسؤول الرفع والمزامنة
              </label>
              <input
                type="text"
                value={uploaderName}
                readOnly
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات التوثيق والاعتماد (اختياري)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات حول اعتماد الساعات أو ختم النموذج..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332] resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition active:scale-95 cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                selectedFile
                  ? 'bg-gradient-to-r from-[#1b4332] via-[#143728] to-[#081c15] text-[#e6c566] hover:shadow-lg border border-[#c59b27]/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#e6c566]" />
              <span>{isSubmitting ? 'جارٍ المزامنة والإرسال...' : 'تأكيد الرفع والمزامنة وإرسال النسخة لبيان الطيار'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
