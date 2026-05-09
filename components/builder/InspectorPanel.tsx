"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useBuilderStore } from "@/store/builder-store";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { SectionLibraryCard } from "./SectionLibraryCard";
import { PropertiesForm } from "./PropertiesForm";
import { ColorsPanel } from "./ColorsPanel";
import { CssPanel } from "./CssPanel";
import { PagesPanel } from "./PagesPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

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
  const editingBlockId = useBuilderStore((s) => s.editingBlockId);
  const setEditingBlock = useBuilderStore((s) => s.setEditingBlock);
  
  const selectedBlock = useBuilderStore((s) =>
    editingBlockId ? s.blocks.find((b) => b.id === editingBlockId) ?? null : null
  );

  const isEditingSection = activeTab === "sections" && editingBlockId !== null;

  let title = "";
  let content = null;

  if (isEditingSection) {
    title = selectedBlock ? findSectionName(selectedBlock.type) : "تعديل القسم";
    content = <PropertiesForm />;
  } else {
    switch (activeTab) {
      case "pages":
        title = "الصفحات";
        content = <PagesPanel />;
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
        content = <CssPanel />;
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
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditingSection ? "editing-" + selectedBlock?.id : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 overflow-auto p-4"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
