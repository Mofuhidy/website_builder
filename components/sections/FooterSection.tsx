"use client";

import { memo } from "react";
import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";

const cairo = Cairo({ subsets: ["arabic"] });

interface FooterSectionProps {
  data: Record<string, JsonValue>;
}

export const FooterSection = memo(function FooterSection({ data }: FooterSectionProps) {
  const logo = (data.logo as string) || "رِكاز";
  const tagline = (data.tagline as string) || "بناء المستقبل، خطوة بخطوة.";
  const copyright = (data.copyright as string) || "© 2026 جميع الحقوق محفوظة.";

  return (
    <footer className={`py-12 px-6 bg-gray-900 text-white ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-2xl font-black mb-1">{logo}</h3>
          <p className="text-gray-400 text-sm">{tagline}</p>
        </div>

        <div className="flex gap-8 text-gray-400 text-sm">
          <a href="#" rel="noreferrer" className="hover:text-accent transition-colors">الرئيسية</a>
          <a href="#" rel="noreferrer" className="hover:text-accent transition-colors">المميزات</a>
          <a href="#" rel="noreferrer" className="hover:text-accent transition-colors">اتصل بنا</a>
        </div>

        <div className="text-gray-500 text-sm">{copyright}</div>
      </div>
    </footer>
  );
});
