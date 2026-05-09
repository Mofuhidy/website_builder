"use client";

import { memo } from "react";
import { JsonValue } from "@/lib/section-registry";
import { SectionMedia } from "./SectionMedia";

interface FeatureItem {
  title: string;
  desc: string;
  mediaType?: string;
  icon?: string;
  imageUrl?: string;
}

interface FeaturesSectionProps {
  data: Record<string, JsonValue>;
}

export const FeaturesSection = memo(function FeaturesSection({ data }: FeaturesSectionProps) {
  const title = (data.title as string) || "لماذا تختارنا؟";
  const items = (data.items as unknown as FeatureItem[]) || [];

  return (
    <section className="py-20 px-6 bg-muted" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl @md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
        </div>

        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {items.map((feature, idx) => (
            <div
              key={idx}
              className="bg-background p-8 rounded-2xl border border-border-color hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 overflow-hidden bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <SectionMedia
                  mediaType={feature.mediaType}
                  icon={feature.icon}
                  imageUrl={feature.imageUrl}
                  label={feature.title}
                  className="h-7 w-7"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
