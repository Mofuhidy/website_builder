"use client";

import { useState } from "react";
import {
  Cog6ToothIcon,
  DocumentMinusIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PageSettingsModal } from "./PageSettingsModal";
import { useBuilderStore } from "@/store/builder-store";

export function PagesPanel() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pageSettings = useBuilderStore((state) => state.pageSettings);
  const setPageSettings = useBuilderStore((state) => state.setPageSettings);
  const hasPage = useBuilderStore((state) => state.hasPage);
  const createPage = useBuilderStore((state) => state.createPage);
  const removePage = useBuilderStore((state) => state.removePage);

  return (
    <section aria-labelledby="pages-panel-title" className="flex min-h-full flex-col space-y-4">
      <div>
        <div>
          <h3 id="pages-panel-title" className="text-base font-semibold">
            الصفحات
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            إدارة الصفحة الحالية وإعداداتها.
          </p>
        </div>
      </div>

      {hasPage ? (
        <article className="group flex w-full items-center gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-4 text-right shadow-sm transition-all hover:border-accent/50 hover:bg-accent/10">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-3 text-right"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm ring-1 ring-accent/10">
              <DocumentIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-gray-950">
                {pageSettings.title}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground" dir="ltr">
                /{pageSettings.slug}
              </span>
            </span>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors group-hover:bg-white group-hover:text-accent"
              aria-hidden="true"
            >
              <Cog6ToothIcon className="h-4 w-4" />
            </span>
          </button>
          <button
            type="button"
            aria-label="حذف الصفحة"
            title="حذف الصفحة"
            onClick={removePage}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </article>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border-color bg-gray-50 px-4 py-12 text-center">
          <DocumentMinusIcon className="mb-4 h-12 w-12 text-gray-400" />
          <p className="text-base font-semibold text-gray-500">
            لا توجد صفحات متاحة
          </p>
          <button
            type="button"
            onClick={createPage}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border-color bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <PlusIcon className="h-4 w-4" />
            إنشاء صفحة
          </button>
        </div>
      )}

      {isSettingsOpen && (
        <PageSettingsModal
          open={isSettingsOpen}
          settings={pageSettings}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(settings) => {
            setPageSettings(settings);
            setIsSettingsOpen(false);
          }}
        />
      )}
    </section>
  );
}
