"use client";

import { DeviceToggle } from "./DeviceToggle";
import { ArrowRight, Globe, Save, Undo, Redo, ExternalLink, Menu, Monitor, Smartphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";

export function TopToolbar() {
  const setDeviceMode = useBuilderStore((state) => state.setDeviceMode);

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
      <div className="hidden md:flex items-center">
        <DeviceToggle />
      </div>

      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-1 rtl:flex-row-reverse border-l border-border-color pl-3 ml-1">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تراجع">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="إعادة">
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <button className="hidden sm:block p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تغيير اللغة">
          <Globe className="w-4 h-4" />
        </button>

        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-border-color bg-white hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span className="hidden lg:inline">زيارة الموقع</span>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" className="w-9 h-9 border-border-color" />}
            >
              <Menu className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent dir="rtl" align="end">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Undo className="w-4 h-4" /> تراجع
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Redo className="w-4 h-4" /> إعادة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("desktop")}>
                <Monitor className="w-4 h-4" /> معاينة ككمبيوتر
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("mobile")}>
                <Smartphone className="w-4 h-4" /> معاينة كجوال
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Globe className="w-4 h-4" /> تغيير اللغة
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ExternalLink className="w-4 h-4" /> زيارة الموقع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">حفظ التغييرات</span>
        </button>
      </div>
    </header>
  );
}
