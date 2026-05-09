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
import { GallerySection } from "./GallerySection";
import { TestimonialsSection } from "./TestimonialsSection";

interface SectionRendererProps {
  block: BuilderBlock;
}

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  features: FeaturesSection,
  cta: CTASection,
  faq: FAQSection,
  footer: FooterSection,
  text: TextSection,
  contact: ContactSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
};

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

  const Component = SECTION_COMPONENTS[block.type];

  if (Component) {
    return <Component data={data} />;
  }

  return (
    <div className="p-16 border-2 border-dashed border-border-color rounded-3xl text-center text-muted-foreground bg-muted/50">
      <p className="text-lg font-bold">قريباً: مكون [{block.type}]</p>
      <p className="text-sm">هذا المكون تحت التطوير حالياً.</p>
    </div>
  );
}
