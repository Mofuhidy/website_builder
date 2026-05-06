"use client";

import { DeviceToggle } from "./DeviceToggle";
import { ArrowRight, Globe, Save, Undo, Redo, ExternalLink } from "lucide-react";

export function TopToolbar() {
  return (
    <header className="h-14 border-b border-border-color bg-white flex items-center justify-between px-4 shrink-0">
      {/* Right side (starts visually on the right in RTL) */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="العودة">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="font-semibold text-lg flex items-center gap-2">
          الرئيسية
          <span className="text-muted-foreground font-normal text-sm">/</span>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center">
        <DeviceToggle />
      </div>

      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rtl:flex-row-reverse border-l border-border-color pl-3 ml-1">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تراجع">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="إعادة">
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تغيير اللغة">
          <Globe className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-border-color bg-white hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-4 h-4" />
          زيارة الموقع
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 text-sm rounded bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          حفظ التغييرات
        </button>
      </div>
    </header>
  );
}
