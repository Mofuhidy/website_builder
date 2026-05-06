import {
  WindowIcon,
  StarIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

export type SectionType = "hero" | "features" | "text" | "gallery" | "footer" | "products" | "stats" | "partners" | "services" | "testimonials" | "contact" | "faq";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface SectionRegistryItem {
  id: SectionType;
  name: string;
  icon: React.ElementType;
  defaultData: Record<string, JsonValue>;
}

export interface SectionCategory {
  id: string;
  name: string;
  items: SectionRegistryItem[];
}

export const CATEGORY_REGISTRY: SectionCategory[] = [
  {
    id: "hero",
    name: "الواجهة الرئيسية",
    items: [
      {
        id: "hero",
        name: "قسم الترحيب",
        icon: WindowIcon,
        defaultData: { title: "عنوان رئيسي جذاب", subtitle: "وصف فرعي" },
      }
    ]
  },
  {
    id: "content",
    name: "المحتوى",
    items: [
      {
        id: "text",
        name: "نص ومقال",
        icon: DocumentTextIcon,
        defaultData: { content: "نص..." },
      },
      {
        id: "gallery",
        name: "معرض الصور",
        icon: PhotoIcon,
        defaultData: { images: [] },
      }
    ]
  },
  {
    id: "features",
    name: "المميزات",
    items: [
      {
        id: "features",
        name: "المميزات",
        icon: StarIcon,
        defaultData: { title: "لماذا تختارنا؟" },
      }
    ]
  },
  {
    id: "products",
    name: "المنتجات",
    items: [
      {
        id: "products",
        name: "قائمة المنتجات",
        icon: ShoppingBagIcon,
        defaultData: { title: "منتجاتنا" },
      }
    ]
  },
  {
    id: "stats",
    name: "إحصائيات",
    items: [
      {
        id: "stats",
        name: "أرقام وإحصائيات",
        icon: ChartBarIcon,
        defaultData: { stats: [] },
      }
    ]
  },
  {
    id: "partners",
    name: "الشركاء",
    items: [
      {
        id: "partners",
        name: "شركاء النجاح",
        icon: UserGroupIcon,
        defaultData: { partners: [] },
      }
    ]
  },
  {
    id: "testimonials",
    name: "آراء العملاء",
    items: [
      {
        id: "testimonials",
        name: "تعليقات العملاء",
        icon: ChatBubbleLeftRightIcon,
        defaultData: { testimonials: [] },
      }
    ]
  },
  {
    id: "faq",
    name: "الأسئلة الشائعة",
    items: [
      {
        id: "faq",
        name: "أسئلة وأجوبة",
        icon: QuestionMarkCircleIcon,
        defaultData: { faqs: [] },
      }
    ]
  },
  {
    id: "contact",
    name: "معلومات التواصل",
    items: [
      {
        id: "contact",
        name: "تواصل معنا",
        icon: PhoneIcon,
        defaultData: { phone: "", email: "" },
      },
      {
        id: "footer",
        name: "تذييل الصفحة",
        icon: LinkIcon,
        defaultData: { copyright: "© 2026" },
      }
    ]
  }
];
