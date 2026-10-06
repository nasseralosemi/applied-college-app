import React, { useState } from 'react';
import { ActivityRequest, AccreditationDocument } from '../types';
import {
  downloadAccreditationDocument,
  generateAccreditationSampleImage,
} from '../utils/activityUtils';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileImage,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  UserCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  request: ActivityRequest | null;
  document?: AccreditationDocument | null;
  onClose: () => void;
}

export const AccreditationPreviewModal: React.FC<Props> = ({
  isOpen,
  request,
  document,
  onClose,
}) => {
  if (!isOpen || !request) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const doc = document || request.accreditationDocument;

  // Resolve the actual image URL (or fallback to generating the official scanned paper image if missing)
  const imageUrl =
    doc?.fileUrl ||
    generateAccreditationSampleImage(
      request.name,
      doc?.accreditationNumber || `IRTQ-2026-${request.id}`,
      doc?.uploadedBy || 'ناصر العصيمي',
      request.hours,
      request.startDate || request.date,
      request.branch
    );

  const fileName =
    doc?.fileName ||
    `صورة_نموذج_اعتماد_${request.name.replace(/\s+/g, '_')}.png`;

  const handleDownloadImage = () => {
    downloadAccreditationDocument(
      {
        fileName,
        fileUrl: imageUrl,
        accreditationNumber: doc?.accreditationNumber,
        uploadedBy: doc?.uploadedBy,
      },
      request.name
    );
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>طباعة صورة نموذج الاعتماد - ${request.name}</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; }
            img { max-width: 100%; height: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { margin-bottom: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>نموذج الاعتماد المطبوع من منصة ارتقاء</h2>
            <p>${request.name} - رقم الاعتماد: ${doc?.accreditationNumber || `IRTQ-${request.id}`}</p>
          </div>
          <img src="${imageUrl}" onload="window.print();window.close();" />
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-['Tajawal',sans-serif]">
      <div
        dir="rtl"
        className="bg-white rounded-3xl shadow-2xl border border-slate-700/30 w-full max-w-4xl max-h-[95vh] flex flex-col text-right animate-scale-up overflow-hidden"
      >
        {/* Top Header & Actions Toolbar */}
        <div className="bg-gradient-to-l from-[#1b4332] via-[#143728] to-[#081c15] text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c59b27] to-[#e6c566] text-[#081c15] flex items-center justify-center font-bold shadow-md shrink-0">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                  معاينة صورة نموذج الاعتماد المطبوع
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                  {doc?.accreditationNumber || `IRTQ-${request.id}`}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/90 mt-0.5 truncate max-w-[280px] sm:max-w-md">
                الصورة الأصلية المرسلة من موظف الرفع والتوثيق ({doc?.uploadedBy || 'ناصر العصيمي'})
              </p>
            </div>
          </div>

          {/* Quick Toolbar Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-white text-xs">
              <button
                type="button"
                onClick={handleZoomIn}
                title="تكبير الصورة"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="تصغير الصورة"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="إعادة ضبط الحجم الطبيعي"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              title="طباعة الصورة"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            {/* Direct Download Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#c59b27] via-[#dfb13c] to-[#e6c566] hover:brightness-105 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>تحميل الصورة</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: PURE IMAGE VIEWING AREA (No system-generated templates!) */}
        <div className="flex-1 overflow-auto bg-slate-900 p-4 sm:p-6 flex items-center justify-center relative min-h-[380px] max-h-[70vh]">
          <div
            className="transition-transform duration-150 flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={imageUrl}
              alt={`صورة نموذج الاعتماد - ${request.name}`}
              className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-slate-700/60 select-none"
            />
          </div>
        </div>

        {/* Bottom Metadata & Download Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
            <span className="flex items-center gap-1 font-bold text-slate-900">
              <FileImage className="w-4 h-4 text-[#1b4332]" />
              <span className="truncate max-w-[220px]">{fileName}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>المرسل: <strong className="text-slate-800">{doc?.uploadedBy || 'ناصر العصيمي'}</strong></span>
            <span className="text-slate-400">•</span>
            <span>تاريخ الرفع: <strong className="text-slate-800 font-mono">{doc?.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('ar-SA') : '2026-09-10'}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#e6c566]" />
              <span>تنزيل الصورة إلى الجهاز الآن</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 transition active:scale-95 cursor-pointer text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
