"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";
import { SortableBlock } from "./SortableBlock";

export function PreviewCanvas() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const deviceMode = useBuilderStore((s) => s.deviceMode);
  const blocks = useBuilderStore((s) => s.blocks);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      moveBlock(oldIndex, newIndex);
    }
  };

  const handleBackgroundClick = () => {
    selectBlock(null);
  };

  const draggedBlock = activeId ? blocks.find((b) => b.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div
        className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start"
        onClick={handleBackgroundClick}
      >
        <div
          className={cn(
            "bg-white min-h-[800px] shadow-sm border flex flex-col transition-all duration-300 rounded-lg overflow-visible",
            deviceMode === "desktop" && "w-full max-w-5xl",
            deviceMode === "tablet" && "w-full max-w-[768px]",
            deviceMode === "mobile" && "w-full max-w-[375px]",
            "border-border-color",
            blocks.length === 0 ? "items-center justify-center" : "",
          )}
        >
          {blocks.length === 0 ? (
            <div className="text-center p-8 pointer-events-none">
              <p className="text-muted-foreground">اضغط على قسم من المكتبة لإضافته</p>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block, idx) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={idx}
                    totalBlocks={blocks.length}
                  />
                ))}
              </SortableContext>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {draggedBlock ? (
          <div className="opacity-80 scale-105 shadow-2xl rounded-lg overflow-hidden">
            <SortableBlock
              block={draggedBlock}
              index={0}
              totalBlocks={blocks.length}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
