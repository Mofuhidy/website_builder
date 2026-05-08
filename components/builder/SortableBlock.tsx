"use client";

import { useEffect, useRef } from "react";
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

export function SortableBlock({
  block,
  index,
  totalBlocks,
}: SortableBlockProps) {
  const selectedBlockId = useBuilderStore(s => s.selectedBlockId);
  const selectBlock = useBuilderStore(s => s.selectBlock);
  const editingBlockId = useBuilderStore(s => s.editingBlockId);
  const setEditingBlock = useBuilderStore(s => s.setEditingBlock);
  const lastAddedBlockId = useBuilderStore(s => s.lastAddedBlockId);

  const isSelected = selectedBlockId === block.id;
  const isNew = lastAddedBlockId === block.id;
  const blockRef = useRef<HTMLDivElement>(null);

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

  // Only scroll + animate for blocks that were just added — not on initial load
  useEffect(() => {
    if (!isNew) return;
    const el = blockRef.current;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    el.animate(
      [
        { opacity: 0, transform: "translateY(14px) scale(0.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 380,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      },
    );
    useBuilderStore.getState().clearLastAdded();
  }, [isNew]);

  const setRefs = (el: HTMLDivElement | null) => {
    (blockRef as React.RefObject<HTMLDivElement | null>).current = el;
    setNodeRef(el);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
    if (editingBlockId !== null) {
      setEditingBlock(block.id);
    }
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "relative overflow-visible cursor-grab active:cursor-grabbing transition-all duration-200",
        isDragging && "opacity-50 z-50 shadow-2xl scale-[1.01]",
        isSelected
          ? "ring-2 ring-accent ring-offset-2 shadow-xl shadow-accent/10 z-10"
          : "ring-1 ring-transparent hover:ring-gray-200 hover:shadow-md",
      )}>
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
