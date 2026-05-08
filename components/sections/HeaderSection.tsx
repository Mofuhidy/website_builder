"use client";

import { memo } from "react";
import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";

const cairo = Cairo({ subsets: ["arabic"] });

interface NavLink {
  label: string;
  href: string;
}

interface HeaderSectionProps {
  data: Record<string, JsonValue>;
}

export const HeaderSection = memo(function HeaderSection({ data }: HeaderSectionProps) {
  const logo = (data.logo as string) || "رِكاز";
  const buttonText = (data.buttonText as string) || "ابدأ مجاناً";
  const rawLinks = data.links as (NavLink | string)[] | undefined;

  const links: NavLink[] = (rawLinks ?? []).map((l) =>
    typeof l === "string" ? { label: l, href: "#" } : l,
  );

  return (
    <header
      className={`py-4 px-6 bg-background/80 backdrop-blur-md border-b border-border-color sticky top-0 z-40 ${cairo.className}`}
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-black text-accent">{logo}</div>

        <nav className="hidden @md:flex gap-8 items-center">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-muted-foreground hover:text-accent transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="px-5 py-2 bg-accent text-white rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all"
        >
          {buttonText}
        </button>
      </div>
    </header>
  );
});
