"use client";

import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";

const cairo = Cairo({ subsets: ["arabic"] });

interface TextSectionProps {
  data: Record<string, JsonValue>;
}

export function TextSection({ data }: TextSectionProps) {
  const content = (data.content as string) || "اكتب هنا النص الذي تريده...";

  return (
    <section className={`py-16 px-6 bg-white ${cairo.className}`} dir="rtl">
      <div className="max-w-3xl mx-auto prose prose-lg prose-gray">
        <p className="text-xl text-gray-700 leading-loose">
          {content}
        </p>
      </div>
    </section>
  );
}
