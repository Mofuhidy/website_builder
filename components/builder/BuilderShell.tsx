"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopToolbar } from "./TopToolbar";
import { RightRail } from "./RightRail";
import { InspectorPanel } from "./InspectorPanel";
import { PreviewCanvas } from "./PreviewCanvas";
import { useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";

export function BuilderShell() {
  const sidebarWidth = useBuilderStore(s => s.sidebarWidth);
  const setSidebarWidth = useBuilderStore(s => s.setSidebarWidth);
  const isResizing = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current) return;

      // In RTL, the sidebar is on the right.
      // width = windowWidth - mouseX
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 280 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    },
    [setSidebarWidth],
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  if (!mounted) return null; // Or a loading skeleton/placeholder

  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden text-foreground">
      <TopToolbar />

      <main className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden relative">
        <aside
          style={{ width: window.innerWidth >= 768 ? sidebarWidth : "100%" }}
          className="h-[50vh] md:h-auto bg-white border-t md:border-t-0 md:border-l border-border-color flex flex-col-reverse md:flex-row shrink-0 relative">
          {/* Resize Handle */}
          <div
            onMouseDown={startResizing}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "hidden md:block absolute top-0 -left-1 w-2 h-full cursor-col-resize z-50 transition-colors",
              isHovered || isResizing.current
                ? "bg-accent/20"
                : "bg-transparent",
            )}
          />

          <RightRail />
          <InspectorPanel />
        </aside>

        <PreviewCanvas />
      </main>
    </div>
  );
}
