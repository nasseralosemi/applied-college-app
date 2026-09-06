import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Layers,
  Terminal,
  Users,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreReadinessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'build' | 'listing' | 'beta' | 'accounts'>('listing');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appTitle = "أنشطة الكلية التطبيقية - ارتقاء";
  const shortDesc = "منظومة إدارة واعتماد الأنشطة والفعاليات والرفع لمنصة ارتقاء الرسمية.";
  const fullDesc = `تطبيق "أنشطة الكلية التطبيقية" هو المنصة الرقمية الموحدة لمنسوبي الكلية لإدارة ومتابعة طلبات الأنشطة والدورات وورش العمل بكفاءة وموثوقية عالية، مع الربط المباشر لتوثيق الساعات في منصة ارتقاء الرسمية.

أهم المميزات والخصائص:
• تقديم الطلبات: رفع بيانات الفعالية، الأهداف، الفئات المستهدفة، وكشوفات الحضور بسهولة ويسر.
• مسار الاعتماد الإداري: متابعة موافقات رؤساء الأقسام والمدراء المباشرين مع إمكانية التوجيه وإبداء الملاحظات.
• التدقيق والمصادقة الأكاديمية: التحقق من استيفاء الضوابط واللوائح قبل المصادقة النهائية من عمادة الكلية.
• التكامل مع منصة ارتقاء: تحويل السجلات وتصدير البيانات المعتمدة لتوثيق الساعات في السجل المهاري للطلبة.
• إشعارات فورية: تتبع حالة الطلب في كل مرحلة خطوة بخطوة مع سجل تاريخي كامل للإجراءات.
• خصوصية وأمان: تشفير كامل للبيانات وارتباط بصلاحيات المستخدمين الرسمية.`;

  const privacyPolicy = `سياسة الخصوصية - تطبيق إدارة واعتماد الأنشطة بالكلية التطبيقية

تلتزم الكلية التطبيقية بحماية بيانات منسوبيها والطلبة المستفيدين وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية (نظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم م/19):

1. جمع البيانات واستخدامها:
- نقوم بجمع بيانات الحساب الرسمية (الرقم الوظيفي/الأكاديمي، الاسم، البريد الإلكتروني الجامعي) لغرض المصادقة وتحديد الصلاحيات.
- تُستخدم بيانات الأنشطة المسجلة (العنوان، الساعات، كشوفات الحضور) حصرياً لأغراض التوثيق الأكاديمي والرفع لمنصة ارتقاء المعتمدة.

2. سرية المعلومات ومشاركتها:
- لا نقوم بمشاركة أي بيانات شخصية مع أي جهات تجارية أو خارجية.
- تقتصر مشاركة البيانات على الأنظمة الأكاديمية الرسمية التابعة للجامعة ومنصة ارتقاء وفق البروتوكولات المعتمدة.

3. أمان البيانات:
- يتم تطبيق أعلى معايير التشفير (SSL/TLS) أثناء نقل البيانات، وتخزينها في خوادم سحابية محمية ومطابقة لضوابط الهيئة الوطنية للأمن السيبراني (NCA).

4. حقوق المستخدم:
- يحق للمستخدم الاطلاع على بياناته المسجلة وسجل الطلبات المعتمدة وطلب التصحيح عبر القنوات الإدارية الرسمية بالكلية.

للتواصل والاستفسار:
عمادة الكلية التطبيقية - وحدة التحول الرقمي والشؤون التعليمية
البريد الإلكتروني الرسمي: support@applied-college.edu.sa`;

  const keystoreCommand = `keytool -genkey -v -keystore release-key.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 \\
  -alias irtqaa-release-key \\
  -dname "CN=Applied College, OU=Academic Affairs, O=University, L=Riyadh, ST=Riyadh, C=SA"`;

  const androidBuildCommand = `# 1. بناء حزمة الواجهة
npm run build

# 2. مزامنة Capacitor
npx cap sync android

# 3. بناء AAB للإنتاج
cd android && ./gradlew bundleRelease`;

  const iosBuildCommand = `# 1. تجهيز الكود ومزامنته مع iOS
npm run build
npx cap sync ios
npx cap open ios

# 2. في Xcode: اختر Any iOS Device (arm64)
# 3. من القائمة: Product > Archive
# 4. اختيار Distribute App > App Store Connect > TestFlight`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1b4332] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c59b27] rounded-xl flex items-center justify-center text-[#1b4332] shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                مركز التجهيز والنشر على المتاجر
              </h3>
              <p className="text-xs text-[#e6c566]">
                Google Play Store & Apple App Store - الكلية التطبيقية
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 px-4 pt-2 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('listing')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'listing'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>بيانات المتجر والهوية (Store Listing)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'build'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>البناء والتوقيع (Build & Signing)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('beta')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'beta'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>الاختبار التجريبي (Beta & TestFlight)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-white border-[#1b4332] text-[#1b4332] shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>الحسابات والصلاحيات (Accounts)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs sm:text-sm">
          {/* TAB 1: STORE LISTING & ASSETS */}
          {activeTab === 'listing' && (
            <div className="space-y-5">
              {/* Visual Assets Preview */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-[#1b4332] text-sm mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#c59b27]" />
                  <span>الأصول البصرية والهوية الجاهزة (Visual Assets)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                    <img src="/pwa-192x192.png" alt="192 Icon" className="w-14 h-14 rounded-xl shadow-sm mb-2" />
                    <span className="font-bold text-gray-800 text-xs">أيقونة 192×192</span>
                    <span className="text-[10px] text-gray-500">PNG مخصصة لـ PWA</span>
                    <a
                      href="/pwa-192x192.png"
                      download="pwa-192x192.png"
                      className="mt-2 text-[10px] bg-green-50 text-[#1b4332] font-bold px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1 hover:bg-green-100"
                    >
                      <Download className="w-3 h-3" />
                      <span>تحميل PNG</span>
                    </a>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                    <img src="/pwa-512x512.png" alt="512 Icon" className="w-14 h-14 rounded-xl shadow-sm mb-2" />
                    <span className="font-bold text-gray-800 text-xs">أيقونة 512×512</span>
                    <span className="text-[10px] text-gray-500">PNG أساسية ومقنعة (Maskable)</span>
                    <a
                      href="/pwa-512x512.png"
                      download="pwa-512x512.png"
                      className="mt-2 text-[10px] bg-green-50 text-[#1b4332] font-bold px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1 hover:bg-green-100"
                    >
                      <Download className="w-3 h-3" />
                      <span>تحميل PNG</span>
                    </a>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                    <img src="/feature-graphic.svg" alt="Feature Graphic" className="w-full h-14 object-cover rounded-xl shadow-xs mb-2" />
                    <span className="font-bold text-gray-800 text-xs">بانر Google Play</span>
                    <span className="text-[10px] text-gray-500">1024×500 px (SVG)</span>
                    <a
                      href="/feature-graphic.svg"
                      download="feature-graphic.svg"
                      className="mt-2 text-[10px] bg-green-50 text-[#1b4332] font-bold px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1 hover:bg-green-100"
                    >
                      <Download className="w-3 h-3" />
                      <span>تحميل البانر</span>
                    </a>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center text-center justify-between">
                    <div className="flex flex-col items-center">
                      <img src="/screenshot-mobile.png" alt="Screenshot" className="w-10 h-14 object-cover rounded-lg shadow-xs mb-1 border border-gray-200" />
                      <span className="font-bold text-gray-800 text-xs">لقطات الشاشة</span>
                      <span className="text-[10px] text-gray-500">جوال وحاسوب (Screenshots)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <a
                        href="/screenshot-mobile.png"
                        download="screenshot-mobile.png"
                        className="text-[10px] bg-green-50 text-[#1b4332] font-bold px-1.5 py-1 rounded-lg border border-green-200 hover:bg-green-100"
                      >
                        جوال
                      </a>
                      <a
                        href="/screenshot-desktop.png"
                        download="screenshot-desktop.png"
                        className="text-[10px] bg-green-50 text-[#1b4332] font-bold px-1.5 py-1 rounded-lg border border-green-200 hover:bg-green-100"
                      >
                        حاسوب
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copywriting Elements */}
              <div className="space-y-3">
                {/* Title */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-700 text-xs">اسم التطبيق (App Name - حد أقصى 30 حرفاً)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('title', appTitle)}
                      className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'title' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl font-bold text-gray-900 text-xs">
                    {appTitle}
                  </div>
                </div>

                {/* Short Description */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-700 text-xs">الوصف المختصر (Short Description - حد أقصى 80 حرفاً)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('short', shortDesc)}
                      className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'short' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-800 text-xs">
                    {shortDesc}
                  </div>
                </div>

                {/* Full Description */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-700 text-xs">الوصف الكامل (Full Store Description)</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('full', fullDesc)}
                      className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'full' ? 'تم النسخ' : 'نسخ النص'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap font-['Tajawal']">
                    {fullDesc}
                  </pre>
                </div>

                {/* Privacy Policy */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-gray-800 text-xs">سياسة الخصوصية الرسمية (Privacy Policy) - متوافقة مع نظام حماية البيانات (PDPL)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('privacy', privacyPolicy)}
                      className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'privacy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'privacy' ? 'تم النسخ' : 'نسخ السياسة'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-gray-50 rounded-xl text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar font-['Tajawal']">
                    {privacyPolicy}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUILD & SIGNING */}
          {activeTab === 'build' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>معرف التطبيق الرسمي الموحد:</strong> <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-900 font-bold">sa.edu.college.irtqaa</code>
                  <br />تم ضبط إعدادات Capacitor و Manifest و Build Scripts في جذر المشروع لتطابق هذا المعرف تلقائياً.
                </div>
              </div>

              {/* Android Keystore Section */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#1b4332] text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>1. إنشاء مفتاح التوقيع الرقمي الآمن (Android Keystore):</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy('keystore', keystoreCommand)}
                    className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'keystore' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'keystore' ? 'تم النسخ' : 'نسخ الأمر'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
                  {keystoreCommand}
                </div>
              </div>

              {/* Android AAB Build Section */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#1b4332] text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>2. بناء حزمة الإنتاج بصيغة AAB (Android App Bundle):</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy('aab', androidBuildCommand)}
                    className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'aab' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'aab' ? 'تم النسخ' : 'نسخ الأوامر'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
                  {androidBuildCommand}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  ينتج الملف في: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">android/app/build/outputs/bundle/release/app-release.aab</code>
                </p>
              </div>

              {/* iOS Xcode Section */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#1b4332] text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>3. متطلبات وبناء Apple App Store عبر Xcode:</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy('ios', iosBuildCommand)}
                    className="text-[11px] text-[#1b4332] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'ios' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ios' ? 'تم النسخ' : 'نسخ الخطوات'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
                  {iosBuildCommand}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <p>• <strong>الشهادات المطلوبة:</strong> Apple Distribution Certificate + App Store Provisioning Profile.</p>
                  <p>• يتم الرفع مباشرة من نافذة <strong>Xcode Organizer ← Distribute App</strong> إلى App Store Connect.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BETA TESTING */}
          {activeTab === 'beta' && (
            <div className="space-y-4">
              {/* Google Play Beta */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-[#1b4332] text-sm mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>أ) مسار الاختبار في Google Play Console (Internal / Closed Testing)</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-700 leading-relaxed pr-3 border-r-2 border-green-300">
                  <p>
                    <strong>1. المسار الداخلي (Internal Testing):</strong><br />
                    - الدخول إلى وحدة تحكم Google Play ← <strong>Release ← Testing ← Internal testing</strong>.<br />
                    - رفع ملف الـ <code className="bg-gray-100 px-1 rounded">app-release.aab</code> مباشرة بدون الحاجة لمراجعة جوجل الطويلة.<br />
                    - إنشاء قائمة بالإيميلات المعتمدة للموظفين (مثل: <code className="bg-gray-100 px-1 rounded">employee@applied-college.edu.sa</code>).
                  </p>
                  <p>
                    <strong>2. دعوة المختبرين:</strong><br />
                    - نسخ رابط الانضمام (Opt-in URL) وإرساله للموظفين عبر البريد أو واتساب العمل.<br />
                    - يقوم الموظف بالنقر على الرابط وتفعيل التثبيت المباشر من متجر Google Play.
                  </p>
                </div>
              </div>

              {/* Apple TestFlight */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-[#1b4332] text-sm mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>ب) مسار الاختبار في Apple TestFlight</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-700 leading-relaxed pr-3 border-r-2 border-blue-300">
                  <p>
                    <strong>1. الاختبار الداخلي (Internal Testers):</strong><br />
                    - يتيح دعوة حتى 100 موظف مسجلين ضمن حساب مطور الكلية.<br />
                    - الإتاحة فورية بمجرد انتهاء معالجة الحزمة على App Store Connect.
                  </p>
                  <p>
                    <strong>2. الاختبار التجريبي الخارجي (External Testing):</strong><br />
                    - إنشاء مجموعة باسم <code className="bg-gray-100 px-1 rounded">منسوبي الكلية التطبيقية</code>.<br />
                    - إنشاء <strong>Public Link</strong> لدعوة حتى 10,000 مستخدم بدون الحاجة لتسجيل إيميلاتهم واحداً تلو الآخر.<br />
                    - تطلب آبل مراجعة مقتضبة للنسخة الأولى (Beta App Review) وتستغرق عادة ساعات معدودة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNTS & ACCESS */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl">
                <h4 className="font-bold text-[#1b4332] text-xs mb-1">
                  متطلبات الحسابات الرسمية للربط والتسليم:
                </h4>
                <p className="text-xs text-gray-600">
                  لتفويض عملية الرفع النهائي، يرجى إتمام الخطوات التالية على حسابات الكلية أو الجامعة:
                </p>
              </div>

              {/* Google Account */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs mb-2 flex items-center justify-between">
                  <span>1. حساب مطور Google Play (Google Play Console Organization Account)</span>
                  <span className="text-[10px] bg-green-100 text-green-900 font-bold px-2 py-0.5 rounded-full">رسوم 25$ لمرة واحدة</span>
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1.5 leading-relaxed">
                  <li><strong>نوع الحساب:</strong> يُشترط أن يكون حساب منظمة (Organization) باسم الكلية/الجامعة وليس حساباً فردياً.</li>
                  <li><strong>رقم D-U-N-S:</strong> توفير رقم D-U-N-S الدولي الخاص بالمؤسسة التعليمية للتحقق.</li>
                  <li><strong>دعوة المطور:</strong> الدخول إلى <strong>Users and permissions ← Invite new users</strong> وإضافة بريد المطور بصلاحية <strong>Admin</strong> أو <strong>Release Manager</strong>.</li>
                </ul>
              </div>

              {/* Apple Account */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs mb-2 flex items-center justify-between">
                  <span>2. حساب مطور آبل (Apple Developer Program Organization)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">اشتراك سنوي 99$ أو إعفاء حكومي</span>
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1.5 leading-relaxed">
                  <li><strong>نوع الحساب:</strong> حساب منظمة تعليمية/حكومية (Higher Education / Government).</li>
                  <li><strong>رقم D-U-N-S:</strong> التحقق من مطابقة الاسم القانوني للكلية/الجامعة في قاعدة D-U-N-S.</li>
                  <li><strong>دعوة المطور في App Store Connect:</strong> الدخول إلى <strong>Users and Access ← (+)</strong> وإضافة بريد المطور بدور <strong>App Manager</strong> أو <strong>Developer</strong> مع تفعيل خانة <em>Access to Certificates, Identifiers & Profiles</em>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500">
            تم إعداد كافة المتطلبات في ملف <code className="bg-gray-200 px-1 py-0.5 rounded font-mono text-gray-800">STORE_DEPLOYMENT_GUIDE.md</code>
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
