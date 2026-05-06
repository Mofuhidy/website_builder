"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderBlock } from "@/store/builder-store";
import { cn } from "@/lib/cn";

interface SortableBlockProps {
  block: BuilderBlock;
}

export function SortableBlock({ block }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: "canvas-block",
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 border border-dashed rounded bg-white cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 z-50 shadow-xl border-accent" : "border-gray-200 hover:border-gray-300",
        "relative group"
      )}
    >
      <span className="text-sm font-bold text-gray-500">[{block.type}]</span>
      <pre className="text-xs mt-2 overflow-auto bg-gray-50 p-2 rounded">
        {JSON.stringify(block.data, null, 2)}
      </pre>
    </div>
  );
}
