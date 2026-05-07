"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderBlock, useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";
import { SectionRenderer } from "../sections/SectionRenderer";
import { FloatingSectionToolbar } from "./FloatingSectionToolbar";

interface SortableBlockProps {
  block: BuilderBlock;
  index: number;
  totalBlocks: number;
}

export function SortableBlock({ block, index, totalBlocks }: SortableBlockProps) {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const selectBlock = useBuilderStore((s) => s.selectBlock);

  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: "canvas-block", block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "relative rounded-lg overflow-visible cursor-grab active:cursor-grabbing transition-all duration-150",
        isDragging && "opacity-50 z-50 shadow-2xl",
        isSelected
          ? "ring-2 ring-accent shadow-lg shadow-accent/10"
          : "ring-1 ring-transparent hover:ring-gray-200",
      )}
    >
      {isSelected && (
        <FloatingSectionToolbar
          blockId={block.id}
          isFirst={index === 0}
          isLast={index === totalBlocks - 1}
        />
      )}

      <SectionRenderer block={block} />
    </div>
  );
}
