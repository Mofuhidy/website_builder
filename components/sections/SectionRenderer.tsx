"use client";

import { BuilderBlock } from "@/store/builder-store";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
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

function getDefaultData(type: string) {
  for (const category of CATEGORY_REGISTRY) {
    for (const item of category.items) {
      if (item.id === type) return item.defaultData;
    }
  }
  return {};
}

export function SectionRenderer({ block }: SectionRendererProps) {
  const defaults = getDefaultData(block.type);
  const data = { ...defaults, ...block.data };

  switch (block.type) {
    case "header":
      return <HeaderSection data={data} />;
    case "hero":
      return <HeroSection data={data} />;
    case "services":
      return <ServicesSection data={data} />;
    case "features":
      return <FeaturesSection data={data} />;
    case "cta":
      return <CTASection data={data} />;
    case "faq":
      return <FAQSection data={data} />;
    case "footer":
      return <FooterSection data={data} />;
    case "text":
      return <TextSection data={data} />;
    case "contact":
      return <ContactSection data={data} />;
    default:
      return (
        <div className="p-16 border-2 border-dashed border-border-color rounded-3xl text-center text-muted-foreground bg-muted/50">
          <p className="text-lg font-bold">قريباً: مكون [{block.type}]</p>
          <p className="text-sm">هذا المكون تحت التطوير حالياً.</p>
        </div>
      );
  }
}

