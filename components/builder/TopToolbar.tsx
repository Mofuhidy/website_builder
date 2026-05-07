"use client";

import { DeviceToggle } from "./DeviceToggle";
import { useRef, useState } from "react";
import { toast } from "sonner";
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
  CheckCircleIcon,
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
  const setDeviceMode = useBuilderStore(state => state.setDeviceMode);
  const blocks = useBuilderStore(state => state.blocks);
  const setBlocks = useBuilderStore(state => state.setBlocks);
  const isDirty = useBuilderStore(state => state.isDirty);
  const markSaved = useBuilderStore(state => state.markSaved);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const MIN_LOADING_MS = 900;

  const handleExport = async () => {
    setIsExporting(true);
    const [dataStr] = await Promise.all([
      Promise.resolve(JSON.stringify(blocks, null, 2)),
      new Promise(r => setTimeout(r, MIN_LOADING_MS)),
    ]);
    const dataUri =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(dataStr as string);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "website-design.json");
    linkElement.click();
    setIsExporting(false);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2500);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const startTime = Date.now();
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const content = e.target?.result as string;
        const importedBlocks = JSON.parse(content);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
        if (Array.isArray(importedBlocks)) {
          setBlocks(importedBlocks);
        } else {
          toast.error("الملف لا يحتوي على تصميم صالح.");
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        toast.error("فشل في استيراد الملف. تأكد من أنه ملف JSON صالح.");
      } finally {
        setIsImporting(false);
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="h-14 border-b border-border-color bg-white flex items-center justify-between px-4 shrink-0">
      {/* Right side (starts visually on the right in RTL) */}
      <div className="flex items-center gap-4">
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="العودة">
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
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="تراجع">
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="إعادة">
            <ArrowUturnRightIcon className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="hidden sm:flex items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="استيراد"
          title="استيراد JSON">
          {isImporting ? (
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            <ArrowDownTrayIcon className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="hidden sm:flex items-center gap-1.5 p-2 transition-colors disabled:opacity-50"
          aria-label="تصدير"
          style={{ color: exportDone ? "#22c55e" : undefined }}
          title="تصدير JSON">
          {isExporting ? (
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : exportDone ? (
            <CheckCircleIcon className="w-4 h-4" />
          ) : (
            <ArrowUpTrayIcon className="w-4 h-4" />
          )}
        </button>

        <button
          className="hidden sm:block p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="تغيير اللغة">
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
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 border-border-color"
                />
              }>
              <Bars3Icon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent dir="rtl" align="end">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={handleImportClick}>
                <ArrowDownTrayIcon className="w-4 h-4" /> استيراد
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={handleExport}>
                <ArrowUpTrayIcon className="w-4 h-4" /> تصدير
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ArrowUturnLeftIcon className="w-4 h-4" /> تراجع
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <ArrowUturnRightIcon className="w-4 h-4" /> إعادة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setDeviceMode("desktop")}>
                <ComputerDesktopIcon className="w-4 h-4" /> معاينة ككمبيوتر
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setDeviceMode("mobile")}>
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
          type="button"
          onClick={markSaved}
          className={`relative flex items-center gap-2 px-3 py-1.5 text-sm rounded  hover:bg-accent-hover transition-colors shadow-sm ${isDirty ? "bg-transparent text-accent border border-accent hover:text-white" : "text-white bg-accent"}`}>
          {isDirty && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 border-2 border-white rounded-full animate-pulse" />
          )}
          <DocumentCheckIcon className="w-4 h-4" />
          <span className="hidden sm:inline">حفظ التغييرات</span>
        </button>
      </div>
    </header>
  );
}
