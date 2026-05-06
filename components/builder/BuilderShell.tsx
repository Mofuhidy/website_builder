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
} from "@dnd-kit/core";
import { DraggableSectionCard } from "./DraggableSectionCard";
import { CATEGORY_REGISTRY } from "@/lib/section-registry";

export function BuilderShell() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = () => {
    setActiveId(null);
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
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
