"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderBlock, useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { SectionRenderer } from "../sections/SectionRenderer";

interface SortableBlockProps {
  block: BuilderBlock;
}

export function SortableBlock({ block }: SortableBlockProps) {
  const removeBlock = useBuilderStore((state) => state.removeBlock);
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden transition-all",
        isDragging ? "opacity-50 z-50 shadow-2xl ring-2 ring-accent" : "hover:ring-1 hover:ring-gray-200",
      )}
    >
      <SectionRenderer block={block} />

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-gray-100"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
