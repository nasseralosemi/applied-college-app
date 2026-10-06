import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AndroidInstallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'instant' | 'apk'>('instant');

  // Shared application URL for direct Android access
  const directAppUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://ais-pre-m53biuz4qgvvcn6xegsaya-517687148689.europe-west3.run.app';

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);

      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If prompt isn't directly triggerable (e.g. running inside desktop or iframe)
      handleCopyLink();
      alert('لتثبيت التطبيق على هاتفك الأندرويد، افتح الرابط المنسوخ في متصفح Google Chrome على هاتفك ثم اضغط على زر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
    }
  };

  const apkBuildCommands = `# 1. بناء حزمة الواجهة
npm run build

# 2. إنشاء بيئة الأندرويد والمزامنة
npx cap add android
npx cap sync android

# 3. بناء ملف الـ APK المباشر للتثبيت الفوري
cd android && ./gradlew assembleDebug

# مسار ملف الـ APK الناتج القابل للتثبيت الفوري:
# android/app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col border border-gray-100 overflow-hidden text-right">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#1b4332] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c59b27] rounded-xl flex items-center justify-center text-[#1b4332] shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                تثبيت التطبيق على هاتف أندرويد (Android)
              </h3>
              <p className="text-xs text-[#e6c566]">
                تثبيت مباشر وفوري (WebAPK / Native Experience)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('instant')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'instant'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c59b27]" />
            <span>التثبيت الفوري والمباشر (موصى به)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>استخراج حزمة ملف APK غير متصل</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs sm:text-sm">
          
          {activeTab === 'instant' ? (
            <div className="space-y-4">
              {/* Highlight Notice */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>نظام أندرويد يدعم تثبيت هذا التطبيق مباشرة كـ WebAPK رسمي!</strong>
                  <br />
                  بمجرد فتح الرابط على هاتفك، سيتولى أندرويد تثبيته كأيقونة مستقلة وتطبيق كامل بدون شريط المتصفح، مع سرعة تصفح فائقة ومزامنة كاملة.
                </div>
              </div>

              {/* QR Code & Direct Link Box */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm shrink-0 flex flex-col items-center">
                  <QRCodeSVG
                    value={directAppUrl}
                    size={130}
                    level="M"
                    includeMargin={false}
                  />
                  <span className="text-[10px] text-gray-500 font-bold mt-1.5 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#c59b27]" />
                    امسح بكاميرا الجوال
                  </span>
                </div>

                <div className="flex-1 text-right w-full space-y-2.5">
                  <span className="text-xs font-bold text-gray-700 block">
                    الرابط المباشر لتشغيل وتثبيت التطبيق على هاتفك:
                  </span>
                  <div className="p-2 bg-white rounded-xl border border-gray-200 font-mono text-[11px] text-gray-800 break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">{directAppUrl}</span>
                    <a
                      href={directAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 shrink-0"
                      title="فتح في نافذة جديدة"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="px-4 py-2 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isInstalled ? 'التطبيق مثبت بالفعل' : 'تثبيت التطبيق الآن'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Step Visual Guide */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2.5">
                <h4 className="font-bold text-[#1b4332] text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c59b27]" />
                  <span>خطوات التثبيت السريع على هاتف أندرويد (30 ثانية):</span>
                </h4>

                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-[#1b4332] text-[#e6c566] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-relaxed">
                      افتح الرابط أعلاه في متصفح <strong>Google Chrome</strong> أو <strong>Samsung Internet</strong> على هاتفك الأندرويد (أو وجه كاميرا الجوال لمسح رمز الباركود).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-[#1b4332] text-[#e6c566] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-relaxed">
                      سيظهر لك شريط تلقائي بالأسفل: <strong>"إضافة إلى الشاشة الرئيسية"</strong> أو اضغط على قائمة المتصفح (الثلاث نقاط <strong>⋮</strong> في الأعلى) واختر <strong>"تثبيت التطبيق"</strong> (Install App).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-[#1b4332] text-[#e6c566] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-relaxed">
                      خلال ثوانٍ، ستظهر أيقونة التطبيق الرسمية بين تطبيقات هاتفك، ويعمل بدون شريط المتصفح وبشاشة كاملة وتحديثات تلقائية مستمرة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>حول ملف الـ APK المباشر (Raw Standalone APK):</strong>
                  <br />
                  بيئة العمل السحابية الحالية لا تحتوي على أدوات Android SDK / Java لبناء ملفات APK ثنائية داخل الحاوية السحابية. ولكن يمكنك استخراج ملف APK محلياً بسهولة تامة عبر تحميل المشروع (Export to ZIP) وتشغيل هذا الأمر:
                </div>
              </div>

              {/* Code Snippet */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800 text-xs">أوامر استخراج ملف الـ APK (Debug/Release APK):</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(apkBuildCommands);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ الأوامر'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
                  <pre>{apkBuildCommands}</pre>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 leading-relaxed space-y-1.5">
                <p className="font-bold text-gray-900">💡 الخطوات العملية للحصول على ملف APK:</p>
                <p>1. قم بتنزيل ملفات المشروع كملف مضغوط عبر قائمة الإعدادات (Settings ⚙️ ← Export to ZIP).</p>
                <p>2. افتح المجلد على جهازك ونفذ الأوامر أعلاه، وسينتج لك ملف الـ APK فوراً في مسار <code className="bg-white px-1 py-0.5 rounded border border-gray-200 font-mono text-gray-800">android/app/build/outputs/apk/debug/app-debug.apk</code>.</p>
                <p>3. يمكنك بعدها إرسال الملف مباشرة لجوالك عبر USB أو WhatsApp وتثبيته فوراً.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500">
            معرف التطبيق: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-800">sa.edu.college.irtqaa</code>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1b4332] hover:bg-[#143728] text-[#e6c566] font-bold rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
