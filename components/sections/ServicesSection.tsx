"use client";

import { memo } from "react";
import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ArrowPathIcon,
  FingerPrintIcon,
  SparklesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

const ICON_POOL = [CloudArrowUpIcon, LockClosedIcon, ArrowPathIcon, FingerPrintIcon, SparklesIcon, GlobeAltIcon];

interface ServiceItem {
  name: string;
  desc: string;
}

interface ServicesSectionProps {
  data: Record<string, JsonValue>;
}

export const ServicesSection = memo(function ServicesSection({ data }: ServicesSectionProps) {
  const title = (data.title as string) || "خدماتنا المتميزة";
  const items = (data.items as unknown as ServiceItem[]) || [];

  return (
    <section className={`py-24 bg-background ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl @md:text-4xl font-extrabold text-foreground mb-4">{title}</h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {items.map((item, idx) => {
            const Icon = ICON_POOL[idx % ICON_POOL.length];
            return (
              <div
                key={idx}
                className="flex flex-col p-8 rounded-3xl border border-border-color hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 transition-all group"
              >
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
