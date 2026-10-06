import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

async function generateAssets() {
  const iconSvgPath = path.join(publicDir, 'icon.svg');
  const iconSvgBuffer = fs.readFileSync(iconSvgPath);

  console.log('Generating 192x192 PNG icon...');
  await sharp(iconSvgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Generating 512x512 PNG icon...');
  await sharp(iconSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Generating Apple Touch Icon (180x180)...');
  await sharp(iconSvgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Maskable icon with 15% safe padding
  console.log('Generating maskable 512x512 icon...');
  const iconInner = await sharp(iconSvgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 27, g: 67, b: 50, alpha: 1 } // #1b4332
    }
  })
  .composite([{ input: iconInner, top: 51, left: 51 }])
  .png()
  .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Screenshots: Mobile (720x1280) and Desktop/Wide (1280x720)
  console.log('Generating screenshot-mobile.png...');
  const mobileSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
    <defs>
      <linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="720" height="1280" fill="url(#bgG)"/>
    
    <!-- Header -->
    <rect width="720" height="130" fill="#1b4332"/>
    <rect x="580" y="35" width="60" height="60" rx="16" fill="#c59b27"/>
    <text x="560" y="60" font-family="sans-serif" font-weight="bold" font-size="28" fill="#ffffff" text-anchor="end">أنشطة الكلية التطبيقية</text>
    <text x="560" y="90" font-family="sans-serif" font-size="18" fill="#e6c566" text-anchor="end">بوابة الاعتماد ومواءمة منصة ارتقاء</text>

    <!-- Stats Bar -->
    <rect x="40" y="160" width="640" height="110" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="640" y="210" font-family="sans-serif" font-size="16" fill="#64748b" text-anchor="end">إجمالي الطلبات: 6</text>
    <text x="640" y="245" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1b4332" text-anchor="end">4 مكتملة وموثقة في ارتقاء</text>

    <!-- Request Card 1 -->
    <rect x="40" y="295" width="640" height="170" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="60" y="315" width="130" height="32" rx="10" fill="#dcfce7"/>
    <text x="125" y="337" font-family="sans-serif" font-weight="bold" font-size="15" fill="#166534" text-anchor="middle">تم الرفع لارتقاء</text>
    <text x="640" y="340" font-family="sans-serif" font-weight="bold" font-size="22" fill="#0f172a" text-anchor="end">دورة التحليل المالي المتقدم</text>
    <text x="640" y="380" font-family="sans-serif" font-size="16" fill="#475569" text-anchor="end">القسم: العلوم الإدارية والمالية • الساعات: 15 ساعة</text>
    <text x="640" y="420" font-family="sans-serif" font-size="15" fill="#64748b" text-anchor="end">رقم التوثيق بارتقاء: IRT-2026-9042</text>

    <!-- Request Card 2 -->
    <rect x="40" y="485" width="640" height="170" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="60" y="505" width="130" height="32" rx="10" fill="#fef3c7"/>
    <text x="125" y="527" font-family="sans-serif" font-weight="bold" font-size="15" fill="#92400e" text-anchor="middle">بانتظار الاعتماد</text>
    <text x="640" y="530" font-family="sans-serif" font-weight="bold" font-size="22" fill="#0f172a" text-anchor="end">معسكر الذكاء الاصطناعي التطبيقي</text>
    <text x="640" y="570" font-family="sans-serif" font-size="16" fill="#475569" text-anchor="end">القسم: تقنية المعلومات • الساعات: 25 ساعة</text>
    <text x="640" y="610" font-family="sans-serif" font-size="15" fill="#64748b" text-anchor="end">المدير المباشر: د. عبد العزيز الفهد</text>

    <!-- Request Card 3 -->
    <rect x="40" y="675" width="640" height="170" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="60" y="695" width="130" height="32" rx="10" fill="#e0f2fe"/>
    <text x="125" y="717" font-family="sans-serif" font-weight="bold" font-size="15" fill="#0369a1" text-anchor="middle">تحت التدقيق</text>
    <text x="640" y="720" font-family="sans-serif" font-weight="bold" font-size="22" fill="#0f172a" text-anchor="end">ملتقى الإرشاد المهني 2026</text>
    <text x="640" y="760" font-family="sans-serif" font-size="16" fill="#475569" text-anchor="end">القسم: شؤون الخريجين • الساعات: 8 ساعات</text>
    <text x="640" y="800" font-family="sans-serif" font-size="15" fill="#64748b" text-anchor="end">المدقق: أ. نورة السالم</text>

    <!-- Action Button -->
    <rect x="40" y="875" width="640" height="70" rx="18" fill="#1b4332"/>
    <text x="360" y="918" font-family="sans-serif" font-weight="bold" font-size="20" fill="#e6c566" text-anchor="middle">+ تقديم طلب نشاط / دورة جديدة</text>

    <!-- Bottom Navigation -->
    <rect y="1180" width="720" height="100" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="120" y="1240" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">الإعدادات</text>
    <text x="360" y="1240" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">التقارير</text>
    <text x="600" y="1240" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1b4332" text-anchor="middle">الرئيسية</text>
  </svg>`;

  await sharp(Buffer.from(mobileSvg))
    .png()
    .toFile(path.join(publicDir, 'screenshot-mobile.png'));

  console.log('Generating screenshot-desktop.png...');
  const desktopSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bgDesk" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bgDesk)"/>

    <!-- Left Context Banner -->
    <rect x="60" y="60" width="460" height="600" rx="24" fill="#1b4332" stroke="#c59b27" stroke-width="2"/>
    <rect x="100" y="100" width="64" height="64" rx="16" fill="#c59b27"/>
    <text x="480" y="210" font-family="sans-serif" font-weight="extrabold" font-size="34" fill="#ffffff" text-anchor="end">نظام اعتماد الأنشطة والدورات</text>
    <text x="480" y="255" font-family="sans-serif" font-size="18" fill="#e6c566" text-anchor="end">الكلية التطبيقية • موائمة منصة ارتقاء</text>
    <text x="480" y="310" font-family="sans-serif" font-size="16" fill="#cbd5e1" text-anchor="end">دورة عمل مؤتمتة لاعتماد وتدقيق الأنشطة الأكاديمية</text>
    
    <!-- Flow pills -->
    <rect x="100" y="350" width="380" height="55" rx="14" fill="#143728"/>
    <text x="450" y="385" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="end">1. تقديم النشاط وكشوف الحضور</text>

    <rect x="100" y="420" width="380" height="55" rx="14" fill="#143728"/>
    <text x="450" y="455" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="end">2. مراجعة المدير المباشر والتدقيق</text>

    <rect x="100" y="490" width="380" height="55" rx="14" fill="#143728"/>
    <text x="450" y="525" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="end">3. التوثيق والرفع الرسمي لمنصة ارتقاء</text>

    <!-- App Mockup on Right -->
    <rect x="570" y="40" width="650" height="640" rx="28" fill="#ffffff" stroke="#334155" stroke-width="3"/>
    <rect x="570" y="40" width="650" height="75" rx="28" fill="#1b4332"/>
    <text x="1180" y="85" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff" text-anchor="end">إدارة ومتابعة طلبات الأنشطة</text>
    <text x="610" y="85" font-family="sans-serif" font-weight="bold" font-size="14" fill="#e6c566">منسوبي الكلية التطبيقية</text>

    <!-- Table Header in Mockup -->
    <rect x="600" y="145" width="590" height="42" rx="10" fill="#f1f5f9"/>
    <text x="1170" y="172" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="end">اسم الفعالية / النشاط</text>
    <text x="940" y="172" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="end">القسم الأكاديمي</text>
    <text x="760" y="172" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="end">الساعات</text>
    <text x="650" y="172" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="end">حالة الاعتماد</text>

    <!-- Row 1 -->
    <rect x="600" y="200" width="590" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1170" y="236" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="end">دورة التحليل المالي المتقدم</text>
    <text x="940" y="236" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">العلوم الإدارية والمالية</text>
    <text x="760" y="236" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">15 ساعة</text>
    <rect x="620" y="215" width="110" height="30" rx="8" fill="#dcfce7"/>
    <text x="675" y="235" font-family="sans-serif" font-size="13" font-weight="bold" fill="#166534" text-anchor="middle">مكتمل في ارتقاء</text>

    <!-- Row 2 -->
    <rect x="600" y="275" width="590" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1170" y="311" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="end">معسكر الذكاء الاصطناعي</text>
    <text x="940" y="311" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">تقنية المعلومات</text>
    <text x="760" y="311" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">25 ساعة</text>
    <rect x="620" y="290" width="110" height="30" rx="8" fill="#fef3c7"/>
    <text x="675" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">بانتظار المدير</text>

    <!-- Row 3 -->
    <rect x="600" y="350" width="590" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1170" y="386" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="end">ملتقى الإرشاد المهني</text>
    <text x="940" y="386" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">شؤون الخريجين</text>
    <text x="760" y="386" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="end">8 ساعات</text>
    <rect x="620" y="365" width="110" height="30" rx="8" fill="#e0f2fe"/>
    <text x="675" y="385" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">تحت التدقيق</text>
  </svg>`;

  await sharp(Buffer.from(desktopSvg))
    .png()
    .toFile(path.join(publicDir, 'screenshot-desktop.png'));

  console.log('All PWA assets successfully generated in public directory!');
}

generateAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
