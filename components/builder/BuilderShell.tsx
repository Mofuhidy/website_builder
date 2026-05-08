"use client";

import { TopToolbar } from "./TopToolbar";
import { RightRail } from "./RightRail";
import { InspectorPanel } from "./InspectorPanel";
import { PreviewCanvas } from "./PreviewCanvas";

export function BuilderShell() {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden text-foreground">
      <TopToolbar />

      <main className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        <aside className="w-full md:w-80 h-[50vh] md:h-auto bg-white border-t md:border-t-0 md:border-l border-border-color flex flex-col-reverse md:flex-row shrink-0">
          <RightRail />
          <InspectorPanel />
        </aside>

        <PreviewCanvas />
      </main>
    </div>
  );
}
