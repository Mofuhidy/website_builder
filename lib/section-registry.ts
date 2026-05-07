import {
  WindowIcon,
  StarIcon,
  PhotoIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  MegaphoneIcon,
  ViewColumnsIcon
} from "@heroicons/react/24/outline";

export type SectionType = 
  | "header" 
  | "hero" 
  | "services" 
  | "features" 
  | "cta" 
  | "footer"
  | "text" 
  | "gallery" 
  | "stats" 
  | "testimonials" 
  | "faq" 
  | "contact";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "list";
}

export interface SectionRegistryItem {
  id: SectionType;
  name: string;
  icon: React.ElementType;
  defaultData: Record<string, JsonValue>;
  editableFields: EditableField[];
}

export interface SectionCategory {
  id: string;
  name: string;
  items: SectionRegistryItem[];
}

export const CATEGORY_REGISTRY: SectionCategory[] = [
  {
    id: "main",
    name: "الأقسام الرئيسية",
    items: [
      {
        id: "header",
        name: "رأس الصفحة",
        icon: ViewColumnsIcon,
        defaultData: { logo: "رِكاز", links: ["الرئيسية", "المميزات", "اتصل بنا"] },
        editableFields: [
          { key: "logo", label: "الشعار", type: "text" }
        ]
      },
      {
        id: "hero",
        name: "قسم الترحيب",
        icon: WindowIcon,
        defaultData: { 
          title: "ابدأ رحلتك الآن", 
          subtitle: "أنشئ صفحة متجاوبة باستخدام أقسام قابلة للتعديل.",
          buttonText: "ابدأ الآن"
        },
        editableFields: [
          { key: "title", label: "العنوان", type: "text" },
          { key: "subtitle", label: "الوصف", type: "textarea" },
          { key: "buttonText", label: "نص الزر", type: "text" }
        ]
      },
      {
        id: "footer",
        name: "تذييل الصفحة",
        icon: LinkIcon,
        defaultData: { copyright: "© 2026 جميع الحقوق محفوظة." },
        editableFields: [
          { key: "copyright", label: "حقوق النشر", type: "text" }
        ]
      }
    ]
  },
  {
    id: "content",
    name: "المحتوى والخدمات",
    items: [
      {
        id: "services",
        name: "خدماتنا",
        icon: Squares2X2Icon,
        defaultData: { title: "خدمات متميزة" },
        editableFields: [
          { key: "title", label: "العنوان", type: "text" }
        ]
      },
      {
        id: "features",
        name: "المميزات",
        icon: StarIcon,
        defaultData: { title: "لماذا تختارنا؟" },
        editableFields: [
          { key: "title", label: "العنوان", type: "text" }
        ]
      },
      {
        id: "cta",
        name: "دعوة للعمل (CTA)",
        icon: MegaphoneIcon,
        defaultData: { title: "جاهز للبدء؟", buttonText: "تواصل معنا" },
        editableFields: [
          { key: "title", label: "العنوان", type: "text" },
          { key: "buttonText", label: "نص الزر", type: "text" }
        ]
      }
    ]
  },
  {
    id: "others",
    name: "أقسام إضافية",
    items: [
      {
        id: "faq",
        name: "الأسئلة الشائعة",
        icon: QuestionMarkCircleIcon,
        defaultData: { title: "الأسئلة الشائعة" },
        editableFields: [{ key: "title", label: "العنوان", type: "text" }]
      },
      {
        id: "testimonials",
        name: "آراء العملاء",
        icon: ChatBubbleLeftRightIcon,
        defaultData: { title: "ماذا يقول عملاؤنا" },
        editableFields: [{ key: "title", label: "العنوان", type: "text" }]
      },
      {
        id: "gallery",
        name: "معرض الصور",
        icon: PhotoIcon,
        defaultData: { title: "معرض الأعمال" },
        editableFields: [{ key: "title", label: "العنوان", type: "text" }]
      },
      {
        id: "contact",
        name: "تواصل معنا",
        icon: PhoneIcon,
        defaultData: { title: "ابق على تواصل" },
        editableFields: [{ key: "title", label: "العنوان", type: "text" }]
      }
    ]
  }
];

