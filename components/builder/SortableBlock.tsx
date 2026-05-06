"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BuilderBlock, useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
        "p-4 border border-dashed rounded bg-white relative group cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 z-50 shadow-xl border-accent" : "border-gray-200 hover:border-gray-300",
      )}
    >
      <div>
        <span className="text-sm font-bold text-gray-500">[{block.type}]</span>
        <pre className="text-xs mt-2 overflow-auto bg-gray-50 p-2 rounded">
          {JSON.stringify(block.data, null, 2)}
        </pre>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        className="absolute top-2 left-2 p-1 text-gray-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
