import { ActivityRequest, UserRole, UserProfile, SystemUser, AuditLogEntry } from './types';
import { generateAccreditationSampleImage } from './utils/activityUtils';

export const INITIAL_REQUESTS: ActivityRequest[] = [];


export const DEFAULT_USERS: SystemUser[] = [
  {
    id: 'u-1',
    employeeNumber: '4412098',
    name: 'عبدالرحمن الطوالة',
    email: 'a.altowalah@mu.edu.sa',
    role: 'emp',
    department: 'قسم تقنية المعلومات',
    branch: 'فرع الزلفي - شطر الطلاب',
    password: '123',
    isActive: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'u-2',
    employeeNumber: '4412001',
    name: 'عمر الخنيني',
    email: 'o.alkhonaini@mu.edu.sa',
    role: 'manager',
    department: 'إدارة البرامج والتدريب',
    branch: 'فرع الزلفي - شطر الطلاب',
    password: '123',
    isActive: true,
    createdAt: '2026-01-05'
  },
  {
    id: 'u-3',
    employeeNumber: '4412002',
    name: 'وائل العفيصان',
    email: 'w.alofaisan@mu.edu.sa',
    role: 'auditor',
    department: 'وحدة التدقيق والاعتماد الأكاديمي',
    branch: 'فرع الزلفي - شطر الطلاب',
    password: '123',
    isActive: true,
    createdAt: '2026-01-08'
  },
  {
    id: 'u-4',
    employeeNumber: '4412003',
    name: 'ناصر العصيمي',
    email: 'n.alosaimi@mu.edu.sa',
    role: 'uploader',
    department: 'وحدة التوثيق ومنصة ارتقاء',
    branch: 'فرع الزلفي - شطر الطلاب',
    password: '123',
    isActive: true,
    createdAt: '2026-01-12'
  },
  {
    id: 'u-5',
    employeeNumber: '4412004',
    name: 'وحدة العلاقات العامة والإعلام',
    email: 'pr.media@mu.edu.sa',
    role: 'pr',
    department: 'وحدة العلاقات العامة والتواصل المؤسسي',
    branch: 'المقر الرئيسي - إدارة الكلية',
    password: '123',
    isActive: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'u-dean',
    employeeNumber: '4412000',
    name: 'سعادة رئيس الكلية التطبيقية',
    email: 'dean.applied@mu.edu.sa',
    role: 'dean',
    department: 'مكتب رئيس الكلية التطبيقية',
    branch: 'المقر الرئيسي - عمادة الكلية',
    password: '123',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'u-accreditation',
    employeeNumber: '4412005',
    name: 'بيان الطيار',
    email: 'b.altayyar@mu.edu.sa',
    role: 'accreditation',
    department: 'وحدة الاعتمادات والتوثيق الأكاديمي',
    branch: 'المقر الرئيسي - إدارة الكلية',
    password: '123',
    isActive: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'u-admin',
    employeeNumber: 'admin',
    name: 'ناصر العصيمي',
    email: 'admin.alosaimi@mu.edu.sa',
    role: 'admin',
    department: 'إدارة النظام والتحكم العام',
    branch: 'المقر الرئيسي - إدارة الكلية',
    password: 'admin',
    isActive: true,
    createdAt: '2026-01-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];


export const ROLE_PROFILES: Record<Exclude<UserRole, 'login'>, UserProfile> = {
  emp: {
    name: "عبدالرحمن الطوالة",
    roleTitle: "مقدم الطلب (Employee)",
    roleBadge: "مقدم الطلب",
    avatarText: "ع ط",
    employeeNumber: "4412098",
    department: "قسم تقنية المعلومات",
    roleKey: "emp"
  },
  manager: {
    name: "عمر الخنيني",
    roleTitle: "المدير المباشر (Direct Manager)",
    roleBadge: "اعتماد المدير المباشر",
    avatarText: "ع خ",
    employeeNumber: "4412001",
    department: "إدارة البرامج والتدريب",
    roleKey: "manager"
  },
  auditor: {
    name: "وائل العفيصان",
    roleTitle: "مدقق المنظومة والاعتماد (Auditor)",
    roleBadge: "مراجعة الضوابط والرئاسة",
    avatarText: "و ع",
    employeeNumber: "4412002",
    department: "وحدة التدقيق والاعتماد الأكاديمي",
    roleKey: "auditor"
  },
  uploader: {
    name: "ناصر العصيمي",
    roleTitle: "مسؤول الرفع والتوثيق (Artaqa Uploader)",
    roleBadge: "التجهيز والرفع النهائي",
    avatarText: "ن ع",
    employeeNumber: "4412003",
    department: "وحدة التوثيق ومنصة ارتقاء",
    roleKey: "uploader"
  },
  pr: {
    name: "وحدة العلاقات العامة والإعلام",
    roleTitle: "مسؤول العلاقات العامة والإعلام (PR & Media)",
    roleBadge: "العلاقات العامة ومنصة X",
    avatarText: "ع ع",
    employeeNumber: "4412004",
    department: "وحدة العلاقات العامة والتواصل المؤسسي",
    roleKey: "pr"
  },
  dean: {
    name: "سعادة رئيس الكلية التطبيقية",
    roleTitle: "رئيس الكلية التطبيقية (Executive Dean)",
    roleBadge: "رئاسة الكلية (نظرة استراتيجية)",
    avatarText: "ر ك",
    employeeNumber: "4412000",
    department: "مكتب رئيس الكلية التطبيقية",
    roleKey: "dean"
  },
  accreditation: {
    name: "بيان الطيار",
    roleTitle: "موظف الاعتمادات والتوثيق (Accreditations)",
    roleBadge: "الاعتمادات - بيان الطيار",
    avatarText: "ب ط",
    employeeNumber: "4412005",
    department: "وحدة الاعتمادات والتوثيق الأكاديمي",
    roleKey: "accreditation"
  },
  admin: {
    name: "ناصر العصيمي",
    roleTitle: "مدير النظام العام (System Admin)",
    roleBadge: "لوحة التحكم والتحكم المركزي",
    avatarText: "ن ع",
    employeeNumber: "admin",
    department: "إدارة النظام والتحكم العام",
    roleKey: "admin"
  }
};
