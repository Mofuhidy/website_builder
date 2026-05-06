"use client";

import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";

const cairo = Cairo({ subsets: ["arabic"] });

interface CTASectionProps {
  data: Record<string, JsonValue>;
}

export function CTASection({ data }: CTASectionProps) {
  const title = (data.title as string) || "جاهز للبدء؟";
  const buttonText = (data.buttonText as string) || "تواصل معنا";

  return (
    <section className={`py-20 px-6 ${cairo.className}`} dir="rtl">
      <div className="max-w-5xl mx-auto rounded-[3rem] bg-accent p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-accent/30">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            {title}
          </h2>
          <button type="button" className="px-10 py-5 bg-white text-accent font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
            {buttonText}
          </button>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>
    </section>
  );
}
