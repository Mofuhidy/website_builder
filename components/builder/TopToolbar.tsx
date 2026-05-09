"use client";

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
import { useBuilderStore } from "@/store/builder-store";
import { createPendingImport, type PendingImport } from "@/lib/builder-utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import { DeviceToggle } from "./DeviceToggle";
import { ImportConfirmationModal } from "./ImportConfirmationModal";

/* ────────────────────────────────────────────────────────────── */
/*  Sub-components — each subscribes to the smallest slice       */
/*  of Zustand state it actually needs to render.                */
/* ────────────────────────────────────────────────────────────── */

function ToolbarTitle() {
  const hasPage = useBuilderStore((s) => s.hasPage);
  const title = useBuilderStore((s) => s.pageSettings.title);
  return (
    <div className="font-semibold text-lg flex items-center gap-2">
      {hasPage ? title : "الصفحات"}
      <span className="text-muted-foreground font-normal text-sm">/</span>
    </div>
  );
}

function ToolbarUndoRedo() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const canUndo = useBuilderStore((s) => s.canUndo());
  const canRedo = useBuilderStore((s) => s.canRedo());

  return (
    <div className="hidden lg:flex items-center gap-1 rtl:flex-row-reverse border-l border-border-color pl-3 ml-1">
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="تراجع"
      >
        <ArrowUturnLeftIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="إعادة"
      >
        <ArrowUturnRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

function ToolbarSaveButton() {
  const isDirty = useBuilderStore((s) => s.isDirty);
  const markSaved = useBuilderStore((s) => s.markSaved);

  return (
    <button
      type="button"
      onClick={markSaved}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-accent-hover transition-colors shadow-sm",
        isDirty
          ? "bg-transparent text-accent border border-accent hover:text-white"
          : "text-white bg-accent",
      )}
    >
      {isDirty && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 border-2 border-white rounded-full animate-pulse" />
      )}
      <DocumentCheckIcon className="w-4 h-4" />
      <span className="hidden sm:inline">حفظ التغييرات</span>
    </button>
  );
}

function MobileMenu({
  onImport,
  onExport,
  isImporting,
  isExporting,
  exportDone,
}: {
  onImport: () => void;
  onExport: () => void;
  isImporting: boolean;
  isExporting: boolean;
  exportDone: boolean;
}) {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const canUndo = useBuilderStore((s) => s.canUndo());
  const canRedo = useBuilderStore((s) => s.canRedo());
  const setDeviceMode = useBuilderStore((s) => s.setDeviceMode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" className="w-9 h-9 border-border-color" />
        }
      >
        <Bars3Icon className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent dir="rtl" align="end">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onImport} disabled={isImporting}>
          {isImporting ? <Spinner /> : <ArrowDownTrayIcon className="w-4 h-4" />} استيراد
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onExport} disabled={isExporting}>
          {isExporting ? (
            <Spinner />
          ) : exportDone ? (
            <CheckCircleIcon className="w-4 h-4" />
          ) : (
            <ArrowUpTrayIcon className="w-4 h-4" />
          )}{" "}
          تصدير
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={undo} disabled={!canUndo}>
          <ArrowUturnLeftIcon className="w-4 h-4" /> تراجع
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={redo} disabled={!canRedo}>
          <ArrowUturnRightIcon className="w-4 h-4" /> إعادة
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("desktop")}>
          <ComputerDesktopIcon className="w-4 h-4" /> معاينة ككمبيوتر
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setDeviceMode("mobile")}>
          <DevicePhoneMobileIcon className="w-4 h-4" /> معاينة كجوال
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  TopToolbar — orchestrates the pieces; avoids subscribing     */
/*  to large store slices (blocks, themeColors, etc.) that are   */
/*  only needed inside click handlers.                           */
/* ────────────────────────────────────────────────────────────── */

export function TopToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);

  const MIN_LOADING_MS = 900;

  const handleExport = async () => {
    setIsExporting(true);
    // Pull latest state at click-time — no need to subscribe the whole toolbar.
    const { blocks, themeColors, customCss, pageSettings, hasPage, fontFamily } =
      useBuilderStore.getState();
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
      new Promise((r) => setTimeout(r, MIN_LOADING_MS)),
    ]);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr as string);
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
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

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

    useBuilderStore.getState().applyImportedState(pendingImport);
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
            aria-label="العودة"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <ToolbarTitle />
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

          <ToolbarUndoRedo />

          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="استيراد"
            title="استيراد JSON"
          >
            {isImporting ? <Spinner /> : <ArrowDownTrayIcon className="w-4 h-4" />}
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
            title="تصدير JSON"
          >
            {isExporting ? (
              <Spinner />
            ) : exportDone ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <ArrowUpTrayIcon className="w-4 h-4" />
            )}
          </button>

          <div className="md:hidden">
            <MobileMenu
              onImport={handleImportClick}
              onExport={handleExport}
              isImporting={isImporting}
              isExporting={isExporting}
              exportDone={exportDone}
            />
          </div>

          <ToolbarSaveButton />
        </div>
      </header>

      <ImportConfirmationModal
        open={pendingImport !== null}
        title="تأكيد استيراد التصميم"
        description="سيتم استبدال التصميم الحالي بالكامل، بما في ذلك الأقسام والألوان وإعدادات الصفحة والخطوط. لا يمكن التراجع عن الاستبدال إلا باستخدام التراجع إذا كان متاحًا."
        notice={pendingImport?.warningMessage}
        onCancel={() => setPendingImport(null)}
        onConfirm={applyPendingImport}
      />
    </>
  );
}
