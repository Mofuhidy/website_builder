"use client";

import { DeviceToggle } from "./DeviceToggle";
import { ImportConfirmationModal } from "./ImportConfirmationModal";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRightIcon,
  DocumentCheckIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
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
import {
  useBuilderStore,
} from "@/store/builder-store";
import {
  createPendingImport,
  type PendingImport,
} from "@/lib/builder-utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

export function TopToolbar() {
  const setDeviceMode = useBuilderStore(state => state.setDeviceMode);
  const blocks = useBuilderStore(state => state.blocks);
  const setBlocks = useBuilderStore(state => state.setBlocks);
  const selectBlock = useBuilderStore(state => state.selectBlock);
  const setEditingBlock = useBuilderStore(state => state.setEditingBlock);
  const themeColors = useBuilderStore(state => state.themeColors);
  const setThemeColors = useBuilderStore(state => state.setThemeColors);
  const customCss = useBuilderStore(state => state.customCss);
  const setCustomCss = useBuilderStore(state => state.setCustomCss);
  const pageSettings = useBuilderStore(state => state.pageSettings);
  const setPageSettings = useBuilderStore(state => state.setPageSettings);
  const hasPage = useBuilderStore(state => state.hasPage);
  const setHasPage = useBuilderStore(state => state.setHasPage);
  const fontFamily = useBuilderStore(state => state.fontFamily);
  const setFontFamily = useBuilderStore(state => state.setFontFamily);
  const undo = useBuilderStore(state => state.undo);
  const redo = useBuilderStore(state => state.redo);
  const canUndo = useBuilderStore(state => state.canUndo());
  const canRedo = useBuilderStore(state => state.canRedo());
  const isDirty = useBuilderStore(state => state.isDirty);
  const markSaved = useBuilderStore(state => state.markSaved);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(
    null,
  );

  const MIN_LOADING_MS = 900;

  const handleExport = async () => {
    setIsExporting(true);
    const exportData = {
      version: 1,
      themeColors,
      customCss,
      pageSettings,
      hasPage,
      fontFamily,
      blocks,
    };
    const [dataStr] = await Promise.all([
      Promise.resolve(JSON.stringify(exportData, null, 2)),
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
        const parsed = JSON.parse(content);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

        const nextImport = createPendingImport(parsed);

        if (!nextImport) {
          toast.error("الملف لا يحتوي على تصميم صالح.");
          return;
        }

        setPendingImport(nextImport);
      } catch {
        toast.error("فشل في استيراد الملف. تأكد من أنه ملف JSON صالح.");
      } finally {
        setIsImporting(false);
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const applyPendingImport = () => {
    if (!pendingImport) return;

    selectBlock(null);
    setEditingBlock(null);
    setBlocks(pendingImport.blocks);
    setThemeColors(pendingImport.themeColors);
    setCustomCss(pendingImport.customCss);
    setPageSettings(pendingImport.pageSettings);
    setHasPage(pendingImport.hasPage);
    setFontFamily(pendingImport.fontFamily);
    toast.success(pendingImport.successMessage);
    setPendingImport(null);
  };

  return (
    <>
      <header className="h-14 border-b border-border-color bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors"
            aria-label="العودة">
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <div className="font-semibold text-lg flex items-center gap-2">
            {hasPage ? pageSettings.title : "الصفحات"}
            <span className="text-muted-foreground font-normal text-sm">/</span>
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <DeviceToggle />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />

          <div className="hidden lg:flex items-center gap-1 rtl:flex-row-reverse border-l border-border-color pl-3 ml-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="تراجع">
              <ArrowUturnLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="إعادة">
              <ArrowUturnRightIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="استيراد"
            title="استيراد JSON">
            {isImporting ? (
              <Spinner />
            ) : (
              <ArrowDownTrayIcon className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              "hidden sm:flex items-center gap-1.5 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent",
              exportDone
                ? "text-green-500 bg-green-50"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-100",
            )}
            aria-label="تصدير"
            title="تصدير JSON">
            {isExporting ? (
              <Spinner />
            ) : exportDone ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <ArrowUpTrayIcon className="w-4 h-4" />
            )}
          </button>

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
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={undo}
                  disabled={!canUndo}>
                  <ArrowUturnLeftIcon className="w-4 h-4" /> تراجع
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={redo}
                  disabled={!canRedo}>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            type="button"
            onClick={markSaved}
            className={cn(
              "relative flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-accent-hover transition-colors shadow-sm",
              isDirty
                ? "bg-transparent text-accent border border-accent hover:text-white"
                : "text-white bg-accent",
            )}>
            {isDirty && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 border-2 border-white rounded-full animate-pulse" />
            )}
            <DocumentCheckIcon className="w-4 h-4" />
            <span className="hidden sm:inline">حفظ التغييرات</span>
          </button>
        </div>
      </header>
      <ImportConfirmationModal
        open={pendingImport !== null}
        title="تأكيد استيراد التصميم"
        description="سيتم استبدال التصميم الحالي بالكامل، بما في ذلك الأقسام والألوان وإعدادات الصفحة والخطوط. لا يمكن التراجع عن الاستبدال إلا باستخدام التراجع إذا كان متاحًا."
        onCancel={() => setPendingImport(null)}
        onConfirm={applyPendingImport}
      />
    </>
  );
}
