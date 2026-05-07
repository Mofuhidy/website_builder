"use client";

import { useBuilderStore } from "@/store/builder-store";
import { SectionRegistryItem } from "@/lib/section-registry";

interface SectionLibraryCardProps {
  section: SectionRegistryItem;
}

export function SectionLibraryCard({ section }: SectionLibraryCardProps) {
  const addBlock = useBuilderStore((s) => s.addBlock);

  const handleClick = () => {
    addBlock({
      id: `${section.id}-${Date.now()}`,
      type: section.id,
      data: { ...section.defaultData },
    });
  };

  const Icon = section.icon;

  return (
    <button
      type="button"
      draggable={false}
      onClick={handleClick}
      aria-label={`إضافة قسم ${section.name}`}
      className="flex items-center gap-3 p-3 w-full bg-white border border-border-color rounded-md cursor-pointer hover:border-accent hover:shadow-sm transition-all text-right select-none"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-50 text-muted-foreground shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm flex-1">{section.name}</span>
    </button>
  );
}
