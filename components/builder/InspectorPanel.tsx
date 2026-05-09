"use client";

import { Suspense } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useBuilderStore } from "@/store/builder-store";
import { useRenderCount } from "@/lib/render-tracker";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { SectionLibraryCard } from "./SectionLibraryCard";
import {
  LazyPropertiesForm,
  LazyPagesPanel,
  LazyFontsPanel,
  LazyColorsPanel,
  LazyCssPanel,
} from "./lazy-panels";
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

function PanelSkeleton() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function InspectorPanel() {
  useRenderCount("InspectorPanel");
  const activeTab = useBuilderStore((s) => s.activeTab);
  const editingBlockId = useBuilderStore((s) => s.editingBlockId);
  const setEditingBlock = useBuilderStore((s) => s.setEditingBlock);

  const selectedBlock = useBuilderStore((s) =>
    editingBlockId ? s.blocks.find((b) => b.id === editingBlockId) ?? null : null,
  );

  const isEditingSection = activeTab === "sections" && editingBlockId !== null;

  let title = "";
  let content = null;

  if (isEditingSection) {
    title = selectedBlock ? findSectionName(selectedBlock.type) : "تعديل القسم";
    content = <LazyPropertiesForm />;
  } else {
    switch (activeTab) {
      case "pages":
        title = "الصفحات";
        content = <LazyPagesPanel />;
        break;
      case "fonts":
        title = "الخطوط";
        content = <LazyFontsPanel />;
        break;
      case "colors":
        title = "الألوان";
        content = <LazyColorsPanel />;
        break;
      case "css":
        title = "CSS مخصص";
        content = <LazyCssPanel />;
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
            onClick={() => setEditingBlock(null)}
            aria-label="العودة إلى مكتبة الأقسام"
            className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/5 transition-colors shrink-0"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
        <h2 className="font-semibold text-base truncate">{title}</h2>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          key={isEditingSection ? "editing-" + selectedBlock?.id : activeTab}
          className="absolute inset-0 overflow-auto p-4 animate-fade-in"
        >
          <Suspense fallback={<PanelSkeleton />}>{content}</Suspense>
        </div>
      </div>
    </div>
  );
}
