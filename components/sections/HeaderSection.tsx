"use client";

import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";

const cairo = Cairo({ subsets: ["arabic"] });

interface HeaderSectionProps {
  data: Record<string, JsonValue>;
}

export function HeaderSection({ data }: HeaderSectionProps) {
  const logo = (data.logo as string) || "رِكاز";
  const links = (data.links as string[]) || ["الرئيسية", "المميزات", "اتصل بنا"];

  return (
    <header className={`py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-black text-accent">{logo}</div>
        
        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link, i) => (
            <a key={i} href="#" className="text-gray-600 hover:text-accent transition-colors font-medium">
              {link}
            </a>
          ))}
        </nav>

        <button type="button" className="px-5 py-2 bg-accent text-white rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all">
          ابدأ مجاناً
        </button>
      </div>
    </header>
  );
}
