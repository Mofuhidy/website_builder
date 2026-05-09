"use client";

import { JsonValue } from "@/lib/section-registry";

interface TextSectionProps {
  data: Record<string, JsonValue>;
}

export function TextSection({ data }: TextSectionProps) {
  const content = (data.content as string) || "اكتب هنا النص الذي تريده...";

  return (
    <section className="py-16 px-6 bg-background" dir="rtl">
      <div className="max-w-3xl mx-auto prose prose-lg prose-gray">
        <p className="text-xl text-foreground leading-loose">
          {content}
        </p>
      </div>
    </section>
  );
}
