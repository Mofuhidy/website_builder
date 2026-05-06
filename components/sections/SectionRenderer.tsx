"use client";

import { BuilderBlock } from "@/store/builder-store";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { FAQSection } from "./FAQSection";
import { FooterSection } from "./FooterSection";

interface SectionRendererProps {
  block: BuilderBlock;
}

export function SectionRenderer({ block }: SectionRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroSection data={block.data} />;
    case "features":
      return <FeaturesSection data={block.data} />;
    case "faq":
      return <FAQSection data={block.data} />;
    case "footer":
      return <FooterSection data={block.data} />;
    default:
      return (
        <div className="p-10 border border-dashed border-gray-200 text-center text-gray-400">
          <p>قريباً: مكون [{block.type}]</p>
        </div>
      );
  }
}
