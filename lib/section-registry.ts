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

export interface ListItemField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
}

export interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "list";
  listFields?: ListItemField[];
  defaultItem?: Record<string, JsonValue>;
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
        defaultData: {
          logo: "رِكاز",
          links: [
            { label: "الرئيسية", href: "/" },
            { label: "المميزات", href: "#features" },
            { label: "اتصل بنا", href: "#contact" },
          ],
          buttonText: "ابدأ مجاناً",
        },
        editableFields: [
          { key: "logo", label: "الشعار النصي", type: "text" },
          { key: "buttonText", label: "نص زر الرأس", type: "text" },
          {
            key: "links",
            label: "روابط التنقل",
            type: "list",
            listFields: [
              { key: "label", label: "عنوان الرابط", type: "text" },
              { key: "href", label: "الرابط", type: "text" },
            ],
            defaultItem: { label: "رابط جديد", href: "/" },
          },
        ],
      },
      {
        id: "hero",
        name: "قسم الترحيب",
        icon: WindowIcon,
        defaultData: {
          title: "ابدأ رحلتك الآن",
          subtitle: "أنشئ صفحة متجاوبة باستخدام أقسام قابلة للتعديل.",
          buttonText: "ابدأ الآن",
          buttonSecondaryText: "اعرف المزيد",
        },
        editableFields: [
          { key: "title", label: "العنوان الرئيسي", type: "text" },
          { key: "subtitle", label: "الوصف", type: "textarea" },
          { key: "buttonText", label: "نص الزر الرئيسي", type: "text" },
          { key: "buttonSecondaryText", label: "نص الزر الثانوي", type: "text" },
        ],
      },
      {
        id: "footer",
        name: "تذييل الصفحة",
        icon: LinkIcon,
        defaultData: {
          logo: "رِكاز",
          tagline: "بناء المستقبل، خطوة بخطوة.",
          copyright: "© 2026 جميع الحقوق محفوظة.",
        },
        editableFields: [
          { key: "logo", label: "الشعار النصي", type: "text" },
          { key: "tagline", label: "الشعار الفرعي", type: "text" },
          { key: "copyright", label: "حقوق النشر", type: "text" },
        ],
      },
    ],
  },
  {
    id: "content",
    name: "المحتوى والخدمات",
    items: [
      {
        id: "services",
        name: "خدماتنا",
        icon: Squares2X2Icon,
        defaultData: {
          title: "خدمات متميزة",
          items: [
            { name: "استضافة سحابية", desc: "نوفر لك أفضل الحلول السحابية لتوسيع نطاق أعمالك." },
            { name: "أمن المعلومات", desc: "حماية بياناتك هي أولويتنا القصوى باستخدام أحدث التقنيات." },
            { name: "تحديثات مستمرة", desc: "نعمل دائماً على تطوير خدماتنا لتبقى في الطليعة." },
            { name: "هوية رقمية", desc: "نساعدك في بناء هوية رقمية فريدة تعبر عنك." },
          ],
        },
        editableFields: [
          { key: "title", label: "عنوان القسم", type: "text" },
          {
            key: "items",
            label: "الخدمات",
            type: "list",
            listFields: [
              { key: "name", label: "اسم الخدمة", type: "text" },
              { key: "desc", label: "الوصف", type: "textarea" },
            ],
            defaultItem: { name: "خدمة جديدة", desc: "وصف الخدمة..." },
          },
        ],
      },
      {
        id: "features",
        name: "المميزات",
        icon: StarIcon,
        defaultData: {
          title: "لماذا تختارنا؟",
          items: [
            { title: "سرعة فائقة", desc: "نحن نضمن أن موقعك يعمل بأعلى سرعة ممكنة لتوفير أفضل تجربة مستخدم." },
            { title: "أمان متكامل", desc: "بياناتك وبيانات عملائك في أمان تام مع أنظمة الحماية المتقدمة لدينا." },
            { title: "جودة استثنائية", desc: "نلتزم بأعلى معايير الجودة في التصميم والتطوير لضمان تميزك." },
          ],
        },
        editableFields: [
          { key: "title", label: "عنوان القسم", type: "text" },
          {
            key: "items",
            label: "المميزات",
            type: "list",
            listFields: [
              { key: "title", label: "عنوان الميزة", type: "text" },
              { key: "desc", label: "الوصف", type: "textarea" },
            ],
            defaultItem: { title: "ميزة جديدة", desc: "وصف الميزة..." },
          },
        ],
      },
      {
        id: "cta",
        name: "دعوة للعمل (CTA)",
        icon: MegaphoneIcon,
        defaultData: {
          title: "جاهز للبدء؟",
          subtitle: "انضم إلى آلاف العملاء الذين يثقون بنا لبناء مستقبلهم الرقمي.",
          buttonText: "تواصل معنا",
        },
        editableFields: [
          { key: "title", label: "العنوان الرئيسي", type: "text" },
          { key: "subtitle", label: "الوصف", type: "textarea" },
          { key: "buttonText", label: "نص الزر", type: "text" },
        ],
      },
    ],
  },
  {
    id: "others",
    name: "أقسام إضافية",
    items: [
      {
        id: "faq",
        name: "الأسئلة الشائعة",
        icon: QuestionMarkCircleIcon,
        defaultData: {
          title: "الأسئلة الشائعة",
          faqs: [
            { q: "كيف يمكنني البدء؟", a: "يمكنك البدء عن طريق اختيار القالب المناسب لك والبدء في تخصيصه." },
            { q: "هل المنصة تدعم اللغة العربية؟", a: "نعم، المنصة تدعم اللغة العربية بشكل كامل مع خطوط عربية جميلة." },
            { q: "ما هي تكلفة الخدمة؟", a: "نوفر باقات متنوعة تناسب جميع الاحتياجات والميزانيات." },
          ],
        },
        editableFields: [
          { key: "title", label: "عنوان القسم", type: "text" },
          {
            key: "faqs",
            label: "الأسئلة والأجوبة",
            type: "list",
            listFields: [
              { key: "q", label: "السؤال", type: "text" },
              { key: "a", label: "الجواب", type: "textarea" },
            ],
            defaultItem: { q: "سؤال جديد؟", a: "الجواب هنا..." },
          },
        ],
      },
      {
        id: "testimonials",
        name: "آراء العملاء",
        icon: ChatBubbleLeftRightIcon,
        defaultData: {
          title: "ماذا يقول عملاؤنا",
          items: [
            { name: "أحمد السعيد", role: "مدير تنفيذي", text: "خدمة ممتازة وفريق محترف جداً. أنصح بها بشدة." },
            { name: "سارة الأمين", role: "مصممة جرافيك", text: "المنصة سهلة الاستخدام وتعطي نتائج احترافية رائعة." },
            { name: "محمد القحطاني", role: "رائد أعمال", text: "وفرت علي الكثير من الوقت والجهد في إنشاء موقعي." },
          ],
        },
        editableFields: [
          { key: "title", label: "عنوان القسم", type: "text" },
          {
            key: "items",
            label: "التقييمات",
            type: "list",
            listFields: [
              { key: "name", label: "اسم العميل", type: "text" },
              { key: "role", label: "المسمى الوظيفي", type: "text" },
              { key: "text", label: "التقييم", type: "textarea" },
            ],
            defaultItem: { name: "اسم العميل", role: "المسمى الوظيفي", text: "تقييم..." },
          },
        ],
      },
      {
        id: "gallery",
        name: "معرض الصور",
        icon: PhotoIcon,
        defaultData: { title: "معرض الأعمال" },
        editableFields: [{ key: "title", label: "عنوان القسم", type: "text" }],
      },
      {
        id: "contact",
        name: "تواصل معنا",
        icon: PhoneIcon,
        defaultData: {
          title: "ابق على تواصل",
          subtitle: "نحن هنا للإجابة على جميع استفساراتك.",
          email: "contact@example.com",
          phone: "+966 50 000 0000",
          buttonText: "إرسال الرسالة",
        },
        editableFields: [
          { key: "title", label: "العنوان الرئيسي", type: "text" },
          { key: "subtitle", label: "الوصف", type: "textarea" },
          { key: "email", label: "البريد الإلكتروني", type: "text" },
          { key: "phone", label: "رقم الهاتف", type: "text" },
          { key: "buttonText", label: "نص زر الإرسال", type: "text" },
        ],
      },
    ],
  },
];
