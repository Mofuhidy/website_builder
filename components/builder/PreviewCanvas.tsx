"use client";

import { useMemo, useState } from "react";
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
import { DocumentMinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { type FontFamily, useBuilderStore } from "@/store/builder-store";
import { scopePreviewCss } from "@/lib/builder-utils";
import { cn } from "@/lib/cn";
import { SortableBlock } from "./SortableBlock";

const PREVIEW_FONT_FAMILIES: Record<FontFamily, string> = {
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  cairo: "'Cairo', system-ui, sans-serif",
  tajawal: "'Tajawal', system-ui, sans-serif",
  almarai: "'Almarai', system-ui, sans-serif",
};

export function PreviewCanvas() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const deviceMode = useBuilderStore((s) => s.deviceMode);
  const blocks = useBuilderStore((s) => s.blocks);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const themeColors = useBuilderStore((s) => s.themeColors);
  const customCss = useBuilderStore((s) => s.customCss);
  const pageSettings = useBuilderStore((s) => s.pageSettings);
  const hasPage = useBuilderStore((s) => s.hasPage);
  const createPage = useBuilderStore((s) => s.createPage);
  const fontFamily = useBuilderStore((s) => s.fontFamily);
  const scopedCustomCss = useMemo(() => scopePreviewCss(customCss), [customCss]);

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

  const draggedBlock = useMemo(
    () => (activeId ? blocks.find((b) => b.id === activeId) : null),
    [activeId, blocks],
  );

  const visibleBlocks = useMemo(
    () =>
      blocks.filter((block) => {
        if (block.type === "header") return pageSettings.showHeader !== false;
        if (block.type === "footer") return pageSettings.showFooter !== false;
        return true;
      }),
    [blocks, pageSettings.showHeader, pageSettings.showFooter],
  );

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
          data-preview-canvas=""
          className={cn(
            "@container bg-background text-foreground min-h-[800px] shadow-sm border flex flex-col transition-all duration-300 rounded-lg overflow-visible",
            deviceMode === "desktop" && "w-full max-w-5xl",
            deviceMode === "tablet" && "w-full max-w-[768px]",
            deviceMode === "mobile" && "w-full max-w-[375px]",
            "border-border-color",
            !hasPage || visibleBlocks.length === 0 ? "items-center justify-center" : "",
          )}
          style={
            {
              "--background": themeColors.background,
              "--foreground": themeColors.foreground,
              "--muted": themeColors.muted,
              "--accent": themeColors.accent,
              fontFamily: PREVIEW_FONT_FAMILIES[fontFamily],
            } as React.CSSProperties
          }
        >
          {scopedCustomCss && <style>{scopedCustomCss}</style>}
          {!hasPage ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <DocumentMinusIcon className="mb-5 h-14 w-14 text-gray-400" />
              <p className="text-3xl font-semibold text-gray-500">
                لا توجد صفحات متاحة
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  createPage();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
              >
                <PlusIcon className="h-4 w-4" />
                إنشاء صفحة جديدة
              </button>
            </div>
          ) : visibleBlocks.length === 0 ? (
            <div className="text-center p-8 pointer-events-none">
              <p className="text-muted-foreground">
                {blocks.length === 0
                  ? "اضغط على قسم من المكتبة لإضافته"
                  : "لا توجد أقسام ظاهرة في المعاينة حاليًا"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <SortableContext
                items={visibleBlocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {visibleBlocks.map((block, idx) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={idx}
                    totalBlocks={visibleBlocks.length}
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
