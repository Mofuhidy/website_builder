"use client";

import { Cairo } from "next/font/google";
import {
  StarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

import { JsonValue } from "@/lib/section-registry";

interface FeaturesSectionProps {
  data: Record<string, JsonValue>;
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const title = (data.title as string) || "لماذا تختارنا؟";
  const defaultFeatures = [
    {
      title: "سرعة فائقة",
      desc: "نحن نضمن أن موقعك يعمل بأعلى سرعة ممكنة لتوفير أفضل تجربة مستخدم.",
      icon: RocketLaunchIcon,
    },
    {
      title: "أمان متكامل",
      desc: "بياناتك وبيانات عملائك في أمان تام مع أنظمة الحماية المتقدمة لدينا.",
      icon: ShieldCheckIcon,
    },
    {
      title: "جودة استثنائية",
      desc: "نلتزم بأعلى معايير الجودة في التصميم والتطوير لضمان تميزك.",
      icon: StarIcon,
    },
  ];

  return (
    <section className={`py-20 px-6 bg-gray-50 ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
