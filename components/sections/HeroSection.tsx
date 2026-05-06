"use client";

import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"] });

interface HeroSectionProps {
  data: any;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className={`relative py-20 px-6 overflow-hidden bg-white ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          {data.title || "عنوان رئيسي جذاب"}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {data.subtitle || "هذا هو الوصف الفرعي الذي يوضح القيمة المقدمة من موقعك بشكل مختصر وجميل."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent/20">
            ابدأ الآن
          </button>
          <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
            اعرف المزيد
          </button>
        </div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50" />
    </section>
  );
}
