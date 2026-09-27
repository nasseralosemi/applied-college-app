import { AttendanceFile, AttendanceRecord } from '../types';

export const SAMPLE_STUDENTS: AttendanceRecord[] = [
  {
    id: 1,
    studentId: '442101982',
    studentName: 'تركي فهد السبيعي',
    college: 'الكلية التطبيقية - علوم الحاسب',
    email: '442101982@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 2,
    studentId: '442102341',
    studentName: 'سعود ناصر الدوسري',
    college: 'الكلية التطبيقية - إدارة الأعمال',
    email: '442102341@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 3,
    studentId: '442103890',
    studentName: 'فيصل عبدالعزيز المطيري',
    college: 'الكلية التطبيقية - تقنية المعلومات',
    email: '442103890@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 4,
    studentId: '442104556',
    studentName: 'نورة خالد العتيبي',
    college: 'الكلية التطبيقية - العلوم الإدارية والمالية',
    email: '442104556@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 5,
    studentId: '442105128',
    studentName: 'سارة محمد الشمري',
    college: 'الكلية التطبيقية - نظم المعلومات',
    email: '442105128@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 6,
    studentId: '442106771',
    studentName: 'عبدالرحمن إبراهيم التميمي',
    college: 'الكلية التطبيقية - تقنية شبكات',
    email: '442106771@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 7,
    studentId: '442107412',
    studentName: 'ريان أحمد الغامدي',
    college: 'الكلية التطبيقية - المحاسبة والمصرفية',
    email: '442107412@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
  {
    id: 8,
    studentId: '442108902',
    studentName: 'فاطمة عبدالله القحطاني',
    college: 'الكلية التطبيقية - إدارة الموارد البشرية',
    email: '442108902@s.mu.edu.sa',
    attendedHours: 2,
    status: 'حاضر',
  },
];

/**
 * Creates a valid, download-ready sample AttendanceFile with UTF-8 BOM CSV / data URL
 */
export function createSampleAttendanceFile(
  activityName: string,
  format: 'excel' | 'pdf' = 'excel',
  hours: string | number = 2
): AttendanceFile {
  const records = SAMPLE_STUDENTS.map((s) => ({
    ...s,
    attendedHours: hours,
  }));

  const cleanName = activityName.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 30);
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

  if (format === 'pdf') {
    const pdfContent = generateSamplePdfText(activityName, records, hours);
    const base64Data = 'data:application/pdf;base64,' + btoa(unescape(encodeURIComponent(pdfContent)));
    return {
      fileName: `كشف_حضور_${cleanName}_معتمد.pdf`,
      fileType: 'pdf',
      fileSize: '412 KB',
      fileData: base64Data,
      uploadedAt: nowStr,
      notes: 'كشف الحضور الرسمي موثق ومطابق لساعات النشاط.',
      sampleRecords: records,
    };
  }

  // Excel / CSV representation with UTF-8 BOM (\uFEFF)
  const csvRows = [
    `"جامعة المجمعة - الكلية التطبيقية"`,
    `"كشف حضور المشاركين في النشاط: ${activityName}"`,
    `"عدد الساعات التدريبية: ${hours} ساعات"`,
    `"تاريخ التوثيق: ${nowStr}"`,
    '',
    `"م","الرقم الجامعي","اسم المتدرب","الكلية والتخصص","البريد الأكاديمي","عدد الساعات","حالة الحضور"`,
    ...records.map(
      (r, idx) =>
        `"${idx + 1}","${r.studentId}","${r.studentName}","${r.college}","${r.email}","${r.attendedHours}","${r.status}"`
    ),
  ];

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const base64Csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

  return {
    fileName: `كشف_حضور_${cleanName}.xlsx`,
    fileType: 'excel',
    fileSize: '248 KB',
    fileData: base64Csv,
    uploadedAt: nowStr,
    notes: 'كشف الحضور المعتمد مستخرج من منصة الحضور بنظام إكسل.',
    sampleRecords: records,
  };
}

/**
 * Downloads the attendance file to user's device
 */
export function downloadAttendanceFile(file: AttendanceFile) {
  try {
    let downloadUrl = file.fileData;

    if (!downloadUrl) {
      // Generate default CSV if no data present
      const records = file.sampleRecords || SAMPLE_STUDENTS;
      const csvRows = [
        `"جامعة المجمعة - الكلية التطبيقية"`,
        `"كشف حضور النشاط: ${file.fileName}"`,
        `"تاريخ التوثيق: ${file.uploadedAt}"`,
        '',
        `"م","الرقم الجامعي","اسم المتدرب","الكلية والتخصص","البريد الأكاديمي","عدد الساعات","حالة الحضور"`,
        ...records.map(
          (r, idx) =>
            `"${idx + 1}","${r.studentId}","${r.studentName}","${r.college}","${r.email}","${r.attendedHours}","${r.status}"`
        ),
      ];
      const csvContent = '\uFEFF' + csvRows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadUrl = URL.createObjectURL(blob);
    }

    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = file.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

/**
 * Parses user selected file into an AttendanceFile record
 */
export async function parseUploadedFile(file: File, notes?: string): Promise<AttendanceFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Determine type
    const lowerName = file.name.toLowerCase();
    let fileType: 'excel' | 'pdf' | 'csv' = 'excel';
    if (lowerName.endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (lowerName.endsWith('.csv')) {
      fileType = 'csv';
    }

    // Format size
    const sizeKb = Math.round(file.size / 1024);
    const fileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      resolve({
        fileName: file.name,
        fileType,
        fileSize,
        fileData: dataUrl,
        uploadedAt: nowStr,
        notes: notes?.trim() || undefined,
        sampleRecords: SAMPLE_STUDENTS,
      });
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}

function generateSamplePdfText(
  activityName: string,
  records: AttendanceRecord[],
  hours: string | number
): string {
  return `%PDF-1.4
%جامعة المجمعة - الكلية التطبيقية
كشف حضور نشاط: ${activityName}
الساعات التدريبية: ${hours} ساعات
إجمالي المتدربين: ${records.length}
`;
}
