"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useBuilderStore } from "@/store/builder-store";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { SectionLibraryCard } from "./SectionLibraryCard";
import { PropertiesForm } from "./PropertiesForm";
import { ColorsPanel } from "./ColorsPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function findSectionName(type: string): string {
  for (const category of CATEGORY_REGISTRY) {
    for (const item of category.items) {
      if (item.id === type) return item.name;
    }
  }
  return type;
}

export function InspectorPanel() {
  const activeTab = useBuilderStore((s) => s.activeTab);
  const selectedBlock = useBuilderStore((s) =>
    s.selectedBlockId ? s.blocks.find((b) => b.id === s.selectedBlockId) ?? null : null
  );
  const selectBlock = useBuilderStore((s) => s.selectBlock);

  const isEditingSection = activeTab === "sections" && selectedBlock !== null;

  let title = "";
  let content = null;

  if (isEditingSection) {
    title = findSectionName(selectedBlock.type);
    content = <PropertiesForm />;
  } else {
    switch (activeTab) {
      case "pages":
        title = "الصفحات";
        content = (
          <p className="text-sm text-muted-foreground">إدارة صفحات الموقع...</p>
        );
        break;
      case "fonts":
        title = "الخطوط";
        content = (
          <p className="text-sm text-muted-foreground">إعدادات الخطوط...</p>
        );
        break;
      case "colors":
        title = "الألوان";
        content = <ColorsPanel />;
        break;
      case "css":
        title = "CSS مخصص";
        content = (
          <p className="text-sm text-muted-foreground">أضف كود CSS...</p>
        );
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
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b border-border-color flex items-center gap-3 min-h-[57px]">
        {isEditingSection && (
          <button
            type="button"
            onClick={() => selectBlock(null)}
            aria-label="العودة إلى مكتبة الأقسام"
            className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/5 transition-colors shrink-0"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
        <h2 className="font-semibold text-base truncate">{title}</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto">{content}</div>
    </div>
  );
}
