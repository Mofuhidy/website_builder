"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";
import { SortableBlock } from "./SortableBlock";

export function PreviewCanvas() {
  const deviceMode = useBuilderStore((state) => state?.deviceMode);
  const blocks = useBuilderStore((state) => state?.blocks);

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas-droppable",
  });

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
      <div
        ref={setNodeRef}
        className={cn(
          "bg-white min-h-[800px] shadow-sm border flex flex-col transition-all duration-300 rounded-lg overflow-hidden",
          deviceMode === "desktop" && "w-full max-w-5xl",
          deviceMode === "tablet" && "w-full max-w-[768px]",
          deviceMode === "mobile" && "w-full max-w-[375px]",
          isOver ? "border-accent border-2 border-dashed bg-accent/5" : "border-border-color",
          blocks.length === 0 ? "items-center justify-center text-muted-foreground" : ""
        )}>
        
        {blocks.length === 0 ? (
          <div className="text-center p-8 pointer-events-none">
            <p>اسحب الأقسام وأفلتها هنا للبدء</p>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full gap-2 p-2">
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}
