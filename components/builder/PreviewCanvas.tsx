"use client";

import { useBuilderStore } from "@/store/builder-store";
import { cn } from "@/lib/cn";

export function PreviewCanvas() {
  const deviceMode = useBuilderStore((state) => state?.deviceMode);

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
      <div
        className={cn(
          "bg-white min-h-[800px] shadow-sm border border-border-color flex items-center justify-center text-muted-foreground transition-all duration-300 rounded-lg",
          deviceMode === "desktop"
            ? "w-full max-w-5xl"
            : "w-full max-w-[375px]",
        )}>
        مساحة الشغل (معاينة)
      </div>
    </div>
  );
}
