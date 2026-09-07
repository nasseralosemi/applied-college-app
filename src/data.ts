import { ActivityRequest, UserRole, UserProfile, SystemUser } from './types';

export const INITIAL_REQUESTS: ActivityRequest[] = [
  {
    id: 101,
    name: "وثق إنجازك",
    type: "نشاط طلابي",
    presenter: "وحدة شؤون الطلاب - فرع الزلفي",
    unit: "وحدة شؤون الطلاب",
    branch: "فرع الزلفي - شطر الطلاب",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    startTime: "10:00 ص",
    hours: "2",
    targetAudience: "الطلاب والطالبات",
    targetGender: "الجنسين (ذكر وأنثى)",
    deliveryMode: "عن بعد",
    meetingUrl: "https://blackboard.mu.edu.sa/webapps/session-101",
    partnershipApproval: "لا تحتاج إلى موافقة",
    coordinatorName: "ناصر بن داود العصيمي",
    summary: "التعريف بمنصة السجل المهاري وآلية الاعتماد ورفع الوثائق للأنشطة غير الصفية",
    status: "pending_manager",
    note: "",
    submittedByEmpNumber: "4412098",
    date: "2026-09-15",
    location: "عن بعد - Blackboard"
  },
  {
    id: 102,
    name: "ورشة مهارات الذكاء الاصطناعي التوليدي",
    type: "ورشة عمل",
    presenter: "قسم تقنية المعلومات - شطر الطلاب",
    unit: "قسم تقنية المعلومات",
    branch: "فرع الزلفي - شطر الطلاب",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    startTime: "09:30 ص",
    hours: "3",
    targetAudience: "الطلاب وأعضاء هيئة التدريس",
    targetGender: "الجنسين (ذكر وأنثى)",
    deliveryMode: "حضوري",
    physicalLocation: "مدرج الكلية التطبيقية الرئيسي - الزلفي",
    partnershipApproval: "لا تحتاج إلى موافقة",
    coordinatorName: "د. عبد العزيز المحمود",
    summary: "تطبيقات الذكاء الاصطناعي في تحسين الإنتاجية الأكاديمية والمهنية وتوليد الحلول البرمجية",
    status: "pending_auditor",
    note: "",
    submittedByEmpNumber: "4412098",
    date: "2026-09-18",
    location: "مدرج الكلية التطبيقية الرئيسي"
  },
  {
    id: 103,
    name: "دورة التميز المؤسسي والجودة الأكاديمية",
    type: "دورة",
    presenter: "وحدة التطوير والجودة",
    unit: "وحدة التطوير والجودة",
    branch: "فرع المجمعة - شطر الطالبات",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    startTime: "11:00 ص",
    hours: "4",
    targetAudience: "الموظفون والكادر الإداري",
    targetGender: "أنثى (شطر الطالبات)",
    deliveryMode: "حضوري",
    physicalLocation: "قاعة التدريب 104 - المجمعة",
    partnershipApproval: "تتطلب موافقة",
    transactionNumber: "44-0982-م",
    coordinatorName: "أ. منى بن سليمان السعد",
    summary: "معايير الاعتماد المؤسسي وضوابط استيفاء ساعات منصة ارتقاء والجودة الشاملة",
    status: "approved_final",
    note: "",
    submittedByEmpNumber: "4412098",
    date: "2026-09-22",
    location: "قاعة التدريب 104 - الزلفي"
  },
  {
    id: 104,
    name: "ملتقى التهيئة للتدريب التعاوني والشراكات",
    type: "ملتقى",
    presenter: "وحدة التدريب الميداني والشراكات",
    unit: "وحدة التدريب والشراكات",
    branch: "فرع الزلفي - شطر الطلاب",
    startDate: "2026-09-08",
    endDate: "2026-09-09",
    startTime: "08:30 ص",
    hours: "5",
    targetAudience: "الطلاب الخريجون",
    targetGender: "ذكر (شطر الطلاب)",
    deliveryMode: "عن بعد",
    meetingUrl: "https://blackboard.mu.edu.sa/webapps/coop-session-2026",
    partnershipApproval: "تتطلب موافقة",
    transactionNumber: "44-1102-ش",
    coordinatorName: "م. خالد بن راشد العتيبي",
    summary: "توجيه الطلاب لجهات التدريب والربط مع المنصة الوطنية وبناء الشراكات المجتمعية",
    status: "uploaded_irtqaa",
    note: "",
    submittedByEmpNumber: "4412098",
    date: "2026-09-08",
    location: "عن بعد - Blackboard"
  }
];

export const DEFAULT_USERS: SystemUser[] = [
  {
    id: 'u-1',
    employeeNumber: '4412098',
    name: 'ناصر بن داود العصيمي',
    role: 'emp',
    department: 'قسم تقنية المعلومات',
    password: '123',
    isActive: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'u-2',
    employeeNumber: '4412001',
    name: 'د. عبد العزيز المحمود',
    role: 'manager',
    department: 'إدارة البرامج والتدريب',
    password: '123',
    isActive: true,
    createdAt: '2026-01-05'
  },
  {
    id: 'u-3',
    employeeNumber: '4412002',
    name: 'أ. منى بن سليمان السعد',
    role: 'auditor',
    department: 'وحدة التدقيق والاعتماد الأكاديمي',
    password: '123',
    isActive: true,
    createdAt: '2026-01-08'
  },
  {
    id: 'u-4',
    employeeNumber: '4412003',
    name: 'م. خالد بن راشد العتيبي',
    role: 'uploader',
    department: 'وحدة التوثيق ومنصة ارتقاء',
    password: '123',
    isActive: true,
    createdAt: '2026-01-12'
  },
  {
    id: 'u-admin',
    employeeNumber: 'admin',
    name: 'د. فيصل بن فهد القحطاني',
    role: 'admin',
    department: 'إدارة النظام والتحكم العام',
    password: 'admin',
    isActive: true,
    createdAt: '2026-01-01'
  }
];

export const ROLE_PROFILES: Record<Exclude<UserRole, 'login'>, UserProfile> = {
  emp: {
    name: "ناصر بن داود العصيمي",
    roleTitle: "موظف (مقدم الطلب)",
    roleBadge: "مقدم الطلب",
    avatarText: "ن ع",
    employeeNumber: "4412098",
    department: "قسم تقنية المعلومات",
    roleKey: "emp"
  },
  manager: {
    name: "د. عبد العزيز المحمود",
    roleTitle: "المدير المباشر",
    roleBadge: "اعتماد المدير المباشر",
    avatarText: "ع م",
    employeeNumber: "4412001",
    department: "إدارة البرامج والتدريب",
    roleKey: "manager"
  },
  auditor: {
    name: "أ. منى بن سليمان السعد",
    roleTitle: "مسؤول التدقيق والاعتماد",
    roleBadge: "مراجعة الضوابط والرئاسة",
    avatarText: "م س",
    employeeNumber: "4412002",
    department: "وحدة التدقيق والاعتماد الأكاديمي",
    roleKey: "auditor"
  },
  uploader: {
    name: "م. خالد بن راشد العتيبي",
    roleTitle: "منسق الرفع لمنصة ارتقاء",
    roleBadge: "التجهيز والرفع النهائي",
    avatarText: "خ ع",
    employeeNumber: "4412003",
    department: "وحدة التوثيق ومنصة ارتقاء",
    roleKey: "uploader"
  },
  admin: {
    name: "د. فيصل بن فهد القحطاني",
    roleTitle: "مدير النظام العام (System Admin)",
    roleBadge: "لوحة التحكم والتحكم المركزي",
    avatarText: "ف ق",
    employeeNumber: "admin",
    department: "إدارة النظام والتحكم العام",
    roleKey: "admin"
  }
};
