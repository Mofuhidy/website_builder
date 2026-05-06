"use client";

import { TopToolbar } from "./TopToolbar";
import { RightRail } from "./RightRail";
import { InspectorPanel } from "./InspectorPanel";
import { PreviewCanvas } from "./PreviewCanvas";

export function BuilderShell() {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden text-foreground">
      <TopToolbar />

      {/* Main Workspace */}
      <main className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        {/* Right Rail / Inspector */}
        <aside className="w-full md:w-80 h-[40vh] md:h-auto bg-white border-t md:border-t-0 md:border-l border-border-color flex shrink-0">
          <RightRail />
          <InspectorPanel />
        </aside>

        <PreviewCanvas />
      </main>
    </div>
  );
}
