"use client";

import { useBuilderStore } from "@/store/builder-store";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";

export function DeviceToggle() {
  const deviceMode = useBuilderStore((state) => state?.deviceMode);
  const setDeviceMode = useBuilderStore((state) => state?.setDeviceMode);

  return (
    <div className="flex items-center gap-1 bg-background p-1 rounded-md border border-border-color">
      <button
        type="button"
        onClick={() => setDeviceMode("desktop")}
        className={cn(
          "p-1.5 rounded transition-colors text-muted-foreground",
          deviceMode === "desktop" && "bg-white text-foreground shadow-sm"
        )}
        aria-label="Desktop Preview"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setDeviceMode("mobile")}
        className={cn(
          "p-1.5 rounded transition-colors text-muted-foreground",
          deviceMode === "mobile" && "bg-white text-foreground shadow-sm"
        )}
        aria-label="Mobile Preview"
      >
        <Smartphone className="w-4 h-4" />
      </button>
    </div>
  );
}
