"use client";

import { BuilderBlock } from "@/store/builder-store";
import { HeaderSection } from "./HeaderSection";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";
import { FAQSection } from "./FAQSection";
import { FooterSection } from "./FooterSection";
import { TextSection } from "./TextSection";
import { ContactSection } from "./ContactSection";

interface SectionRendererProps {
  block: BuilderBlock;
}

export function SectionRenderer({ block }: SectionRendererProps) {
  switch (block.type) {
    case "header":
      return <HeaderSection data={block.data} />;
    case "hero":
      return <HeroSection data={block.data} />;
    case "services":
      return <ServicesSection data={block.data} />;
    case "features":
      return <FeaturesSection data={block.data} />;
    case "cta":
      return <CTASection data={block.data} />;
    case "faq":
      return <FAQSection data={block.data} />;
    case "footer":
      return <FooterSection data={block.data} />;
    case "text":
      return <TextSection data={block.data} />;
    case "contact":
      return <ContactSection data={block.data} />;
    default:
      return (
        <div className="p-16 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400 bg-gray-50/50">
          <p className="text-lg font-bold">قريباً: مكون [{block.type}]</p>
          <p className="text-sm">هذا المكون تحت التطوير حالياً.</p>
        </div>
      );
  }
}
