"use client";

import { useBuilderStore } from "@/store/builder-store";
import { SectionRegistryItem } from "@/lib/section-registry";
import { cn } from "@/lib/cn";

interface DraggableSectionCardProps {
  section: SectionRegistryItem;
}

export function DraggableSectionCard({ section }: DraggableSectionCardProps) {
  const addBlock = useBuilderStore((state) => state?.addBlock);

  const handleClick = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: section.id,
      data: section.defaultData,
    });
  };

  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 w-full bg-white border border-border-color rounded-md cursor-pointer hover:border-accent hover:shadow-sm transition-all text-right"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-50 text-muted-foreground shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm flex-1">{section.name}</span>
    </button>
  );
}
