"use client";

import { memo } from "react";
import { JsonValue } from "@/lib/section-registry";

interface HeroSectionProps {
  data: Record<string, JsonValue>;
}

export const HeroSection = memo(function HeroSection({ data }: HeroSectionProps) {
  const title = (data.title as string) || "ابدأ رحلتك الآن";
  const subtitle = (data.subtitle as string) || "أنشئ صفحة متجاوبة باستخدام أقسام قابلة للتعديل.";
  const buttonText = (data.buttonText as string) || "ابدأ الآن";
  const buttonSecondaryText = (data.buttonSecondaryText as string) || "اعرف المزيد";

  return (
    <section
      className="relative py-20 px-6 overflow-hidden bg-background"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl @md:text-6xl font-black text-foreground mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {buttonText && (
            <button
              type="button"
              className="px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
            >
              {buttonText}
            </button>
          )}
          {buttonSecondaryText && (
            <button
              type="button"
              className="px-8 py-4 bg-background text-foreground font-bold rounded-lg border border-border-color hover:bg-muted transition-all"
            >
              {buttonSecondaryText}
            </button>
          )}
        </div>
      </div>

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50" />
    </section>
  );
});
