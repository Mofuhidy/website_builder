"use client";

import { useBuilderStore } from "@/store/builder-store";
import { ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon } from "@heroicons/react/24/outline";
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
          "p-1.5 rounded transition-colors text-muted-foreground hover:text-foreground",
          deviceMode === "desktop" && "bg-white text-foreground shadow-sm"
        )}
        aria-label="Desktop Preview"
      >
        <ComputerDesktopIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setDeviceMode("tablet")}
        className={cn(
          "p-1.5 rounded transition-colors text-muted-foreground hover:text-foreground",
          deviceMode === "tablet" && "bg-white text-foreground shadow-sm"
        )}
        aria-label="Tablet Preview"
      >
        <DeviceTabletIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setDeviceMode("mobile")}
        className={cn(
          "p-1.5 rounded-sm transition-all",
          deviceMode === "mobile"
            ? "bg-white shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Mobile Preview"
      >
        <DevicePhoneMobileIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
