"use client";

import { useDraggable } from "@dnd-kit/core";
import { SectionRegistryItem } from "@/lib/section-registry";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/cn";

interface DraggableSectionCardProps {
  section: SectionRegistryItem;
  isOverlay?: boolean;
}

export function DraggableSectionCard({ section, isOverlay }: DraggableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `registry-${section.id}`,
    data: {
      type: "sidebar-section",
      sectionType: section.id,
      defaultData: section.defaultData,
    },
    disabled: isOverlay, // Disable drag behavior if it's already an overlay
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const Icon = section.icon;

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      className={cn(
        "flex items-center gap-3 p-3 bg-white border border-border-color rounded-md cursor-grab active:cursor-grabbing hover:border-accent hover:shadow-sm transition-all",
        isDragging && !isOverlay && "opacity-50 border-dashed"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-50 text-muted-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm">{section.name}</span>
    </div>
  );
}
