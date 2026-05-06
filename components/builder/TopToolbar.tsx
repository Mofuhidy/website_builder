"use client";

import { DeviceToggle } from "./DeviceToggle";
import { useRef } from "react";
import {
  ArrowRightIcon,
  GlobeAltIcon,
  DocumentCheckIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
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
  const blocks = useBuilderStore((state) => state.blocks);
  const setBlocks = useBuilderStore((state) => state.setBlocks);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(blocks, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "website-design.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedBlocks = JSON.parse(content);
          if (Array.isArray(importedBlocks)) {
            setBlocks(importedBlocks);
          }
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          alert("فشل في استيراد الملف. تأكد من أنه ملف JSON صالح.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="h-14 border-b border-border-color bg-white flex items-center justify-between px-4 shrink-0">
      {/* Right side (starts visually on the right in RTL) */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="العودة">
          <ArrowRightIcon className="w-5 h-5" />
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
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-1 rtl:flex-row-reverse border-l border-border-color pl-3 ml-1">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تراجع">
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="إعادة">
            <ArrowUturnRightIcon className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={handleImportClick}
          className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors" 
          aria-label="استيراد"
          title="استيراد JSON"
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
        </button>

        <button 
          onClick={handleExport}
          className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors" 
          aria-label="تصدير"
          title="تصدير JSON"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
        </button>

        <button className="hidden sm:block p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="تغيير اللغة">
          <GlobeAltIcon className="w-4 h-4" />
        </button>

        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-border-color bg-white hover:bg-gray-50 transition-colors">
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          <span className="hidden lg:inline">زيارة الموقع</span>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" className="w-9 h-9 border-border-color" />}
            >
              <Bars3Icon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent dir="rtl" align="end">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleImportClick}>
                <ArrowUpTrayIcon className="w-4 h-4" /> استيراد
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleExport}>
                <ArrowDownTrayIcon className="w-4 h-4" /> تصدير
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ArrowUturnLeftIcon className="w-4 h-4" /> تراجع
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ArrowUturnRightIcon className="w-4 h-4" /> إعادة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("desktop")}>
                <ComputerDesktopIcon className="w-4 h-4" /> معاينة ككمبيوتر
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("mobile")}>
                <DevicePhoneMobileIcon className="w-4 h-4" /> معاينة كجوال
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <GlobeAltIcon className="w-4 h-4" /> تغيير اللغة
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ArrowTopRightOnSquareIcon className="w-4 h-4" /> زيارة الموقع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
        >
          <DocumentCheckIcon className="w-4 h-4" />
          <span className="hidden sm:inline">حفظ التغييرات</span>
        </button>
      </div>
    </header>
  );
}
