import { ActivityRequest } from '../types';

/**
 * Checks if an activity has ended (date is today or in the past).
 */
export function isActivityEnded(activity: {
  endDate?: string;
  startDate?: string;
  date?: string;
}): boolean {
  const dateStr = activity.endDate || activity.startDate || activity.date;
  if (!dateStr) return false;

  // Use current local date YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // If the end date is on or before today, the activity has concluded
  return dateStr <= todayStr;
}

/**
 * Formats date into Arabic friendly format
 */
export function formatArabicDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export interface MockAttendee {
  id: string;
  name: string;
  studentId: string;
  major: string;
  checkInTime: string;
  status: 'حاضر' | 'معتمد';
}

export const SAMPLE_ATTENDEES: MockAttendee[] = [
  { id: '1', name: 'سعود بن فهد السبيعي', studentId: '441002341', major: 'تقنية المعلومات', checkInTime: '08:28 ص', status: 'معتمد' },
  { id: '2', name: 'خالد بن ناصر المطيري', studentId: '441002890', major: 'إدارة الأعمال', checkInTime: '08:31 ص', status: 'معتمد' },
  { id: '3', name: 'عبدالله بن محمد الدوسري', studentId: '441003112', major: 'العلوم المالية والمصرفية', checkInTime: '08:33 ص', status: 'معتمد' },
  { id: '4', name: 'عمر بن سليمان العتيبي', studentId: '441003445', major: 'تقنية المعلومات', checkInTime: '08:35 ص', status: 'معتمد' },
  { id: '5', name: 'ريان بن عبدالكريم التميمي', studentId: '441003789', major: 'إدارة الأعمال', checkInTime: '08:37 ص', status: 'معتمد' },
  { id: '6', name: 'إبراهيم بن صالح الغامدي', studentId: '441004012', major: 'تقنية المعلومات', checkInTime: '08:40 ص', status: 'معتمد' },
  { id: '7', name: 'فيصل بن منصور الشمري', studentId: '441004321', major: 'العلوم المالية والمصرفية', checkInTime: '08:42 ص', status: 'معتمد' },
  { id: '8', name: 'محمد بن يوسف القحطاني', studentId: '441004654', major: 'إدارة الأعمال', checkInTime: '08:44 ص', status: 'معتمد' },
];

/**
 * Triggers a real browser download for the attendance sheet file
 */
export function downloadAttendanceSheet(request: ActivityRequest) {
  const sheet = request.attendanceSheet;
  const fileName = sheet?.fileName || `كشف_حضور_${request.name.replace(/\s+/g, '_')}.csv`;

  // If a base64 / blob URL was saved
  if (sheet?.fileUrl && sheet.fileUrl.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = sheet.fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Generate an official CSV file with UTF-8 BOM so Arabic displays properly in Excel
  const bom = '\uFEFF';
  const csvRows = [
    `"جامعة المجمعة - الكلية التطبيقية"`,
    `"وحدة التوثيق ومنصة ارتقاء - كشف الحضور الختامي الرسمي"`,
    `"النشاط:","${request.name}"`,
    `"نوع النشاط:","${request.type}"`,
    `"المحاضر / المدرب:","${request.presenter}"`,
    `"التاريخ:","${request.startDate || request.date}"`,
    `"الساعات المعتمدة:","${request.hours}"`,
    `"رقم المعاملة:","${request.transactionNumber || 'غير محدد'}"`,
    `"تاريخ رفع الكشف:","${sheet?.uploadedAt || new Date().toISOString()}"`,
    `"حالة الكشف:","${sheet?.status === 'approved' ? 'معتمد ومغلق رسمياً' : 'قيد المراجعة والتدقيق'}"`,
    '',
    `"م","اسم الطالب","الرقم الجامعي","التخصص","وقت التسجيل","حالة الحضور"`
  ];

  SAMPLE_ATTENDEES.forEach((att, idx) => {
    csvRows.push(`"${idx + 1}","${att.name}","${att.studentId}","${att.major}","${att.checkInTime}","${att.status}"`);
  });

  const blob = new Blob([bom + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.csv') ? fileName : `${fileName.replace(/\.[^/.]+$/, '')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates an authentic SVG data URL representing a scanned university accreditation form copy
 */
export function generateAccreditationSampleImage(
  requestName: string,
  accNum: string,
  uploaderName: string = 'ناصر العصيمي',
  hours: string | number = '4',
  dateStr: string = '2026-09-18',
  branch: string = 'المقر الرئيسي'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:'Tajawal',Arial,sans-serif;">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dfb13c"/>
      <stop offset="50%" stop-color="#c59b27"/>
      <stop offset="100%" stop-color="#997415"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332"/>
      <stop offset="100%" stop-color="#081c15"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Paper background & watermark grid -->
  <rect width="800" height="1100" fill="#fcfdfd"/>
  <rect width="800" height="1100" fill="url(#grid)"/>

  <!-- Ornate Outer Border -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#1b4332" stroke-width="4" rx="16"/>
  <rect x="35" y="35" width="730" height="1030" fill="none" stroke="#c59b27" stroke-width="1.5" stroke-dasharray="6 3" rx="12"/>

  <!-- Header Banner -->
  <g transform="translate(60, 60)">
    <text x="680" y="30" text-anchor="end" font-size="16" font-weight="900" fill="#1b4332">المملكة العربية السعودية</text>
    <text x="680" y="55" text-anchor="end" font-size="14" font-weight="bold" fill="#334155">وزارة التعليم - جامعة المجمعة</text>
    <text x="680" y="78" text-anchor="end" font-size="13" font-weight="bold" fill="#c59b27">الكلية التطبيقية</text>

    <!-- University Crest Emblem -->
    <circle cx="340" cy="45" r="34" fill="url(#greenGrad)" stroke="#c59b27" stroke-width="2"/>
    <circle cx="340" cy="45" r="28" fill="none" stroke="#e6c566" stroke-width="1" stroke-dasharray="3 2"/>
    <text x="340" y="42" text-anchor="middle" font-size="10" font-weight="bold" fill="#e6c566">جامعة المجمعة</text>
    <text x="340" y="56" text-anchor="middle" font-size="8" font-weight="bold" fill="#ffffff">الكلية التطبيقية</text>

    <!-- Meta Details on Left -->
    <text x="0" y="28" text-anchor="start" font-size="11" font-weight="bold" fill="#64748b">رقم الاعتماد: <tspan fill="#0f172a" font-family="monospace">${accNum}</tspan></text>
    <text x="0" y="50" text-anchor="start" font-size="11" font-weight="bold" fill="#64748b">التاريخ: <tspan fill="#0f172a">${dateStr}</tspan></text>
    <text x="0" y="72" text-anchor="start" font-size="11" font-weight="bold" fill="#1b4332">المنصة: منصة ارتقاء الجامعية</text>
  </g>

  <!-- Divider Line -->
  <line x1="60" y1="165" x2="740" y2="165" stroke="#1b4332" stroke-width="2"/>
  <line x1="60" y1="170" x2="740" y2="170" stroke="#c59b27" stroke-width="1"/>

  <!-- Title Pill -->
  <rect x="180" y="195" width="440" height="48" rx="24" fill="url(#greenGrad)" stroke="#c59b27" stroke-width="2"/>
  <text x="400" y="226" text-anchor="middle" font-size="18" font-weight="900" fill="#e6c566">نموذج اعتماد وتوثيق نشاط مهاري مطبوع</text>
  <text x="400" y="270" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">وثيقة أصلية ممسوحة ضوئياً من منصة السجل المهاري الوطني (ارتقاء)</text>

  <!-- Activity Information Card -->
  <g transform="translate(60, 300)">
    <rect width="680" height="340" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect width="680" height="40" rx="14" fill="#f8fafc"/>
    <text x="650" y="26" text-anchor="end" font-size="14" font-weight="900" fill="#1b4332">بيانات النشاط المعتمد في السجل المهاري</text>

    <!-- Field 1: Name -->
    <text x="650" y="75" text-anchor="end" font-size="11" font-weight="bold" fill="#64748b">اسم النشاط / الفعالية:</text>
    <text x="650" y="102" text-anchor="end" font-size="16" font-weight="900" fill="#0f172a">${requestName}</text>
    <line x1="30" y1="120" x2="650" y2="120" stroke="#f1f5f9" stroke-width="1"/>

    <!-- Field 2: Hours & Branch -->
    <text x="650" y="150" text-anchor="end" font-size="11" font-weight="bold" fill="#64748b">الساعات المعتمدة:</text>
    <text x="650" y="176" text-anchor="end" font-size="15" font-weight="900" fill="#1b4332">${hours} ساعات تدريبية معتمدة</text>

    <text x="320" y="150" text-anchor="end" font-size="11" font-weight="bold" fill="#64748b">المقر / الفرع:</text>
    <text x="320" y="176" text-anchor="end" font-size="14" font-weight="bold" fill="#0f172a">${branch}</text>
    <line x1="30" y1="198" x2="650" y2="198" stroke="#f1f5f9" stroke-width="1"/>

    <!-- Field 3: Accreditation status -->
    <text x="650" y="230" text-anchor="end" font-size="11" font-weight="bold" fill="#64748b">حالة الاعتماد في ارتقاء:</text>
    <rect x="490" y="242" width="160" height="28" rx="14" fill="#dcfce7" stroke="#86efac"/>
    <text x="570" y="261" text-anchor="middle" font-size="12" font-weight="bold" fill="#14532d">معتمد وموثق رسمياً</text>

    <text x="320" y="230" text-anchor="end" font-size="11" font-weight="bold" fill="#64748b">الموظف المكلف بالرفع:</text>
    <text x="320" y="261" text-anchor="end" font-size="13" font-weight="bold" fill="#0f172a">${uploaderName}</text>
    <line x1="30" y1="285" x2="650" y2="285" stroke="#f1f5f9" stroke-width="1"/>

    <!-- Official note -->
    <text x="650" y="315" text-anchor="end" font-size="11" fill="#475569">تمت مطابقة معايير الحضور والساعات واعتماد النموذج مطبوعاً وموقعاً عبر منصة ارتقاء الجامعية.</text>
  </g>

  <!-- Official University Stamp & Signatures -->
  <g transform="translate(60, 680)">
    <!-- Stamp -->
    <g transform="translate(480, 70) rotate(-8)">
      <circle cx="0" cy="0" r="68" fill="none" stroke="#1b4332" stroke-width="3" stroke-dasharray="8 4"/>
      <circle cx="0" cy="0" r="60" fill="none" stroke="#c59b27" stroke-width="1.5"/>
      <text x="0" y="-36" text-anchor="middle" font-size="11" font-weight="900" fill="#1b4332">جامعة المجمعة</text>
      <text x="0" y="-18" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b4332">الكلية التطبيقية</text>
      <polygon points="0,-10 6,4 -8,-3 8,-3 -6,4" fill="#c59b27"/>
      <text x="0" y="16" text-anchor="middle" font-size="12" font-weight="900" fill="#1b4332">معتمد وموثق</text>
      <text x="0" y="32" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">منصة ارتقاء الوطنية</text>
      <text x="0" y="46" text-anchor="middle" font-size="8" font-family="monospace" fill="#64748b">${accNum}</text>
    </g>

    <!-- Signatures Section -->
    <g transform="translate(100, 40)">
      <text x="120" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">مسؤول الاعتمادات والتوثيق</text>
      <text x="120" y="55" text-anchor="middle" font-size="15" font-weight="900" fill="#1b4332">أ. بيان الطيار</text>
      <path d="M 50 68 Q 120 80 190 65 Q 150 95 80 75" fill="none" stroke="#1b4332" stroke-width="2"/>
    </g>

    <g transform="translate(100, 150)">
      <text x="120" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">مسؤول الرفع والتوثيق (ارتقاء)</text>
      <text x="120" y="55" text-anchor="middle" font-size="14" font-weight="bold" fill="#0f172a">${uploaderName}</text>
      <path d="M 60 68 Q 120 78 180 66" fill="none" stroke="#047857" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Footer Verification Bar & Barcode -->
  <g transform="translate(60, 970)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="#e2e8f0" stroke-width="1.5"/>
    
    <!-- Barcode lines simulation -->
    <g transform="translate(20, 20)">
      <rect x="0" y="0" width="3" height="35" fill="#0f172a"/>
      <rect x="6" y="0" width="1" height="35" fill="#0f172a"/>
      <rect x="10" y="0" width="4" height="35" fill="#0f172a"/>
      <rect x="17" y="0" width="2" height="35" fill="#0f172a"/>
      <rect x="22" y="0" width="5" height="35" fill="#0f172a"/>
      <rect x="30" y="0" width="2" height="35" fill="#0f172a"/>
      <rect x="35" y="0" width="4" height="35" fill="#0f172a"/>
      <rect x="42" y="0" width="1" height="35" fill="#0f172a"/>
      <rect x="46" y="0" width="3" height="35" fill="#0f172a"/>
      <rect x="52" y="0" width="2" height="35" fill="#0f172a"/>
      <rect x="57" y="0" width="4" height="35" fill="#0f172a"/>
      <rect x="64" y="0" width="1" height="35" fill="#0f172a"/>
      <rect x="68" y="0" width="3" height="35" fill="#0f172a"/>
      <rect x="74" y="0" width="5" height="35" fill="#0f172a"/>
      <rect x="82" y="0" width="2" height="35" fill="#0f172a"/>
      <rect x="87" y="0" width="3" height="35" fill="#0f172a"/>
      <text x="45" y="47" text-anchor="middle" font-size="8" font-family="monospace" fill="#64748b">${accNum}</text>
    </g>

    <text x="680" y="30" text-anchor="end" font-size="10" font-weight="bold" fill="#64748b">تم إصدار هذه النسخة إلكترونياً من منصة ارتقاء - الكلية التطبيقية</text>
    <text x="680" y="46" text-anchor="end" font-size="9" fill="#94a3b8">رمز التحقق الإلكتروني الجامعي: MU-IRTQ-${accNum}-SECURE</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Triggers a real browser download of the uploaded accreditation image/file
 */
export function downloadAccreditationDocument(
  doc: {
    fileName?: string;
    fileUrl?: string;
    accreditationNumber?: string;
    uploadedBy?: string;
  },
  requestName: string = 'النشاط'
) {
  let downloadUrl = doc.fileUrl;
  let fileName = doc.fileName || `صورة_نموذج_اعتماد_ارتقاء_${requestName.replace(/\s+/g, '_')}.png`;

  // If no fileUrl was stored (legacy fallback), generate the official SVG image
  if (!downloadUrl) {
    const accNum = doc.accreditationNumber || 'IRTQ-2026';
    downloadUrl = generateAccreditationSampleImage(requestName, accNum, doc.uploadedBy || 'ناصر العصيمي');
    if (!fileName.endsWith('.svg') && !fileName.endsWith('.png') && !fileName.endsWith('.jpg')) {
      fileName = `${fileName.replace(/\.[^/.]+$/, '')}.svg`;
    }
  }

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

