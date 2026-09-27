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
