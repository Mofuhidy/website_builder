"use client";

import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";
import { 
  CloudArrowUpIcon, 
  LockClosedIcon, 
  ArrowPathIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

interface ServicesSectionProps {
  data: Record<string, JsonValue>;
}

export function ServicesSection({ data }: ServicesSectionProps) {
  const title = (data.title as string) || "خدماتنا المتميزة";
  const services = [
    { name: 'استضافة سحابية', icon: CloudArrowUpIcon, desc: 'نوفر لك أفضل الحلول السحابية لتوسيع نطاق أعمالك.' },
    { name: 'أمن المعلومات', icon: LockClosedIcon, desc: 'حماية بياناتك هي أولويتنا القصوى باستخدام أحدث التقنيات.' },
    { name: 'تحديثات مستمرة', icon: ArrowPathIcon, desc: 'نعمل دائماً على تطوير خدماتنا لتبقى في الطليعة.' },
    { name: 'هوية رقمية', icon: FingerPrintIcon, desc: 'نساعدك في بناء هوية رقمية فريدة تعبر عنك.' },
  ];

  return (
    <section className={`py-24 bg-white ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{title}</h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col p-8 rounded-3xl border border-gray-100 hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 transition-all group">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
