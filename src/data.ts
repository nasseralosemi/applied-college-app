import { ActivityRequest, UserRole, UserProfile } from './types';

export const INITIAL_REQUESTS: ActivityRequest[] = [
  {
    id: 101,
    name: "وثق إنجازك",
    type: "نشاط طلابي",
    presenter: "وحدة شؤون الطلاب - فرع الزلفي",
    date: "2026-09-15",
    hours: "2",
    location: "عن بعد - Blackboard",
    summary: "التعريف بمنصة السجل المهاري وآلية الاعتماد ورفع الوثائق",
    status: "pending_manager",
    note: ""
  },
  {
    id: 102,
    name: "ورشة مهارات الذكاء الاصطناعي التوليدي",
    type: "ورشة عمل",
    presenter: "قسم تقنية المعلومات - شطر الطلاب",
    date: "2026-09-18",
    hours: "3",
    location: "مدرج الكلية التطبيقية الرئيسي",
    summary: "تطبيقات الذكاء الاصطناعي في تحسين الإنتاجية الأكاديمية والمهنية",
    status: "pending_auditor",
    note: ""
  },
  {
    id: 103,
    name: "دورة التميز المؤسسي والجودة الأكاديمية",
    type: "دورة تدريبية",
    presenter: "وحدة التطوير والجودة",
    date: "2026-09-22",
    hours: "4",
    location: "قاعة التدريب 104 - الزلفي",
    summary: "معايير الاعتماد المؤسسي وضوابط استيفاء ساعات منصة ارتقاء",
    status: "approved_final",
    note: ""
  },
  {
    id: 104,
    name: "ملتقى التهيئة للتدريب التعاوني",
    type: "معرض / ملتقى",
    presenter: "وحدة التدريب الميداني والشراكات",
    date: "2026-09-08",
    hours: "5",
    location: "عن بعد - Blackboard",
    summary: "توجيه الطلاب لجهات التدريب والربط مع المنصة الوطنية",
    status: "uploaded_irtqaa",
    note: ""
  }
];

export const ROLE_PROFILES: Record<Exclude<UserRole, 'login'>, UserProfile> = {
  emp: {
    name: "ناصر بن داود العصيمي",
    roleTitle: "موظف (مقدم الطلب)",
    roleBadge: "مقدم الطلب",
    avatarText: "ن ع"
  },
  manager: {
    name: "د. عبد العزيز المحمود",
    roleTitle: "المدير المباشر",
    roleBadge: "اعتماد المدير المباشر",
    avatarText: "ع م"
  },
  auditor: {
    name: "أ. منى بن سليمان السعد",
    roleTitle: "مسؤول التدقيق والاعتماد",
    roleBadge: "مراجعة الضوابط والرئاسة",
    avatarText: "م س"
  },
  uploader: {
    name: "م. خالد بن راشد العتيبي",
    roleTitle: "منسق الرفع لمنصة ارتقاء",
    roleBadge: "التجهيز والرفع النهائي",
    avatarText: "خ ع"
  }
};
