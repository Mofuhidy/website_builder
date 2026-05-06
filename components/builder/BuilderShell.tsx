"use client";

import { useState } from "react";
import { TopToolbar } from "./TopToolbar";
import { RightRail } from "./RightRail";
import { InspectorPanel } from "./InspectorPanel";
import { PreviewCanvas } from "./PreviewCanvas";

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useBuilderStore } from "@/store/builder-store";
import { DraggableSectionCard } from "./DraggableSectionCard";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";
import { SortableBlock } from "./SortableBlock";

export function BuilderShell() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const addBlock = useBuilderStore(state => state?.addBlock);
  const moveBlock = useBuilderStore(state => state?.moveBlock);
  const insertBlock = useBuilderStore(state => state?.insertBlock);
  const blocks = useBuilderStore(state => state?.blocks);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeData = active?.data?.current;
    const overData = over?.data?.current;

    // 1. Reordering existing blocks within the canvas
    if (
      activeData?.type === "canvas-block" &&
      overData?.type === "canvas-block"
    ) {
      const oldIndex = blocks?.findIndex(b => b.id === active.id);
      const newIndex = blocks?.findIndex(b => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        moveBlock(oldIndex, newIndex);
      }
      return;
    }

    // 2. Dropping a new section from the sidebar
    if (activeData?.type === "sidebar-section") {
      const newBlock = {
        id: crypto.randomUUID(),
        type: activeData?.sectionType,
        data: activeData?.defaultData,
      };

      // If dropped over an existing block, insert it there
      if (overData?.type === "canvas-block") {
        const overIndex = blocks?.findIndex(b => b.id === over?.id);
        if (overIndex !== -1) {
          // If dragging downwards, insert below. If upwards, insert above.
          // dnd-kit gives more info, but for simplicity we insert at the over index.
          insertBlock(newBlock, overIndex);
          return;
        }
      }

      // Otherwise, just append it to the end (dropped on empty canvas area)
      if (over.id === "canvas-droppable") {
        addBlock(newBlock);
      }
    }
  };

  // Find the active section being dragged
  const activeSection = activeId
    ? CATEGORY_REGISTRY.flatMap(cat => cat.items).find(
        item => `registry-${item.id}` === activeId,
      )
    : null;

  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden text-foreground">
      <TopToolbar />

      {/* Main Workspace */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}>
        <main className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
          {/* Right Rail / Inspector */}
          <aside className="w-full md:w-80 h-[40vh] md:h-auto bg-white border-t md:border-t-0 md:border-l border-border-color flex shrink-0">
            <RightRail />
            <InspectorPanel />
          </aside>

          <PreviewCanvas />
        </main>

        <DragOverlay>
          {activeSection ? (
            <div className="opacity-80 scale-105 transition-transform shadow-lg rounded-md">
              <DraggableSectionCard section={activeSection} isOverlay />
            </div>
          ) : activeId && blocks.find(b => b.id === activeId) ? (
            <div className="opacity-80 scale-105 transition-transform shadow-lg rounded-md bg-white">
              <SortableBlock block={blocks.find(b => b.id === activeId)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
