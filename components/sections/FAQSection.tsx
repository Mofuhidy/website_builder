"use client";

import { Cairo } from "next/font/google";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

import { JsonValue } from "@/lib/section-registry";

interface FAQSectionProps {
  data: Record<string, JsonValue>;
}

export function FAQSection({ data }: FAQSectionProps) {
  const faqs = (data.faqs as { q: string; a: string }[]) || [
    { q: "كيف يمكنني البدء؟", a: "يمكنك البدء عن طريق اختيار القالب المناسب لك والبدء في تخصيصه." },
    { q: "هل المنصة تدعم اللغة العربية؟", a: "نعم، المنصة تدعم اللغة العربية بشكل كامل مع خطوط عربية جميلة." },
    { q: "ما هي تكلفة الخدمة؟", a: "نوفر باقات متنوعة تناسب جميع الاحتياجات والميزانيات." },
  ];

  return (
    <section className={`py-20 px-6 bg-white ${cairo.className}`} dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            الأسئلة الشائعة
          </h2>
          <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button className="w-full flex items-center justify-between p-6 text-right bg-white hover:bg-gray-50 transition-colors group">
                <span className="font-bold text-gray-900">{faq.q}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
              </button>
              <div className="p-6 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/30">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
