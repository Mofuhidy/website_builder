"use client";

import { useBuilderStore } from "@/store/builder-store";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { SectionLibraryCard } from "./SectionLibraryCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function InspectorPanel() {
  const activeTab = useBuilderStore((state) => state?.activeTab);

  let title = "";
  let content = null;

  switch (activeTab) {
    case "pages":
      title = "الصفحات";
      content = <div className="text-sm text-muted-foreground">إدارة صفحات الموقع...</div>;
      break;
    case "fonts":
      title = "الخطوط";
      content = <div className="text-sm text-muted-foreground">إعدادات الخطوط...</div>;
      break;
    case "colors":
      title = "الألوان";
      content = <div className="text-sm text-muted-foreground">إعدادات الألوان...</div>;
      break;
    case "css":
      title = "CSS مخصص";
      content = <div className="text-sm text-muted-foreground">أضف كود CSS...</div>;
      break;
    case "sections":
      title = "الأقسام";
      content = (
        <Accordion className="w-full">
          {CATEGORY_REGISTRY.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="font-medium text-sm py-3 hover:no-underline hover:text-accent transition-colors">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 pt-1 pb-3">
                  {category.items.map((section) => (
                    <SectionLibraryCard key={section.id} section={section} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
      break;
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b border-border-color">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {content}
      </div>
    </div>
  );
}
