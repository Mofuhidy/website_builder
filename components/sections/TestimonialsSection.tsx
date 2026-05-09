"use client";

import { memo } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { JsonValue } from "@/lib/section-registry";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  data: Record<string, JsonValue>;
}

export const TestimonialsSection = memo(function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const title = (data.title as string) || "ماذا يقول عملاؤنا";
  const items = (data.items as unknown as TestimonialItem[]) || [];

  return (
    <section className="py-20 px-6 bg-muted" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground @md:text-4xl">{title}</h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-accent" />
        </div>

        <div className="grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex min-h-64 flex-col rounded-3xl border border-border-color bg-background p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <ChatBubbleLeftRightIcon className="mb-5 h-8 w-8 text-accent" />
              <p className="flex-1 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-accent/10 text-accent">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                      {item.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
