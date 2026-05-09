"use client";

import React, { Suspense, useMemo } from "react";
import { BuilderBlock } from "@/store/builder-store";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { useRenderTracker } from "@/lib/render-tracker";
import {
  LazyHeaderSection,
  LazyHeroSection,
  LazyServicesSection,
  LazyFeaturesSection,
  LazyCTASection,
  LazyFAQSection,
  LazyFooterSection,
  LazyTextSection,
  LazyContactSection,
  LazyGallerySection,
  LazyTestimonialsSection,
} from "./lazy-sections";

interface SectionRendererProps {
  block: BuilderBlock;
}

const SECTION_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: BuilderBlock["data"] }>
> = {
  header: LazyHeaderSection,
  hero: LazyHeroSection,
  services: LazyServicesSection,
  features: LazyFeaturesSection,
  cta: LazyCTASection,
  faq: LazyFAQSection,
  footer: LazyFooterSection,
  text: LazyTextSection,
  contact: LazyContactSection,
  gallery: LazyGallerySection,
  testimonials: LazyTestimonialsSection,
};

function SectionSkeleton() {
  return (
    <div className="p-16 border-2 border-dashed border-border-color rounded-3xl text-center text-muted-foreground bg-muted/50 animate-pulse">
      <p className="text-lg font-bold">جاري التحميل...</p>
    </div>
  );
}

function getDefaultData(type: string) {
  for (const category of CATEGORY_REGISTRY) {
    for (const item of category.items) {
      if (item.id === type) return item.defaultData;
    }
  }
  return {};
}

export const SectionRenderer = React.memo(function SectionRenderer({
  block,
}: SectionRendererProps) {
  useRenderTracker("SectionRenderer", { type: block.type, id: block.id });
  const data = useMemo(() => {
    const defaults = getDefaultData(block.type);
    return { ...defaults, ...block.data };
  }, [block.type, block.data]);

  const Component = SECTION_COMPONENTS[block.type];

  if (Component) {
    return (
      <Suspense fallback={<SectionSkeleton />}>
        <Component data={data} />
      </Suspense>
    );
  }

  return (
    <div className="p-16 border-2 border-dashed border-border-color rounded-3xl text-center text-muted-foreground bg-muted/50">
      <p className="text-lg font-bold">قريباً: مكون [{block.type}]</p>
      <p className="text-sm">هذا المكون تحت التطوير حالياً.</p>
    </div>
  );
});
