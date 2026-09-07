export type RequestStatus =
  | 'pending_manager'
  | 'returned_emp'
  | 'pending_auditor'
  | 'returned_manager'
  | 'approved_final'
  | 'uploaded_irtqaa'
  | 'rejected';

export type UserRole = 'login' | 'emp' | 'manager' | 'auditor' | 'uploader' | 'admin';

export interface SystemUser {
  id: string;
  employeeNumber: string;
  name: string;
  email?: string;
  role: Exclude<UserRole, 'login'>;
  department: string;
  branch?: string;
  password?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  type: 'approve' | 'return' | 'upload' | 'user_edit' | 'password_reset' | 'status_toggle' | 'create';
}

export interface ActivityRequest {
  id: number;
  name: string;
  type: string; // ورشة عمل، زيارة، معرض، مجتمعي، دورة، ملتقى، نشاط طلابي
  presenter: string;
  unit: string; // الوحدة المشرفة
  branch: string; // الفرع
  startDate: string; // تاريخ بداية النشاط
  endDate: string; // تاريخ نهاية النشاط
  startTime: string; // وقت بداية النشاط
  hours: string | number; // عدد الساعات التدريبية
  targetAudience: string; // الفئة المستهدفة
  targetGender: string; // النوع (ذكر / أنثى / الجنسين)
  deliveryMode: 'عن بعد' | 'حضوري'; // حالة النشاط
  meetingUrl?: string; // رابط النشاط (في حال عن بعد)
  physicalLocation?: string; // موقع النشاط (في حال حضوري)
  partnershipApproval: 'لا تحتاج إلى موافقة' | 'تتطلب موافقة'; // مركز التعاون والشراكات
  transactionNumber?: string; // رقم المعاملة (في الاتصالات الإدارية)
  coordinatorName: string; // منسق النشاط
  summary: string; // ملخص النشاط والأهداف
  status: RequestStatus;
  note: string;
  submittedAt?: string;
  submittedByEmpNumber?: string;
  // مسار الاعتماد الإداري والتوجيه الذكي
  deanApproved?: boolean;
  deanApprovalDate?: string;
  assignedUploader?: string; // الموظف المكلف بالرفع لمنصة ارتقاء
  xPlatformPublish?: boolean; // يتطلب إعلان رسمي في منصة X
  uploaderInstructions?: string; // مربع التعليمات والتوجيهات للموظف المكلف بالرفع
  // Backwards compatibility fallbacks
  date?: string;
  location?: string;
}

export interface UserProfile {
  name: string;
  roleTitle: string;
  roleBadge: string;
  avatarText: string;
  employeeNumber?: string;
  department?: string;
  roleKey?: Exclude<UserRole, 'login'>;
}
