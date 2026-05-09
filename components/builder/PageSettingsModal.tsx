"use client";

import { useEffect, useId, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type PageSettings } from "@/store/builder-store";
import { cn } from "@/lib/cn";

interface PageSettingsModalProps {
  open: boolean;
  settings: PageSettings;
  onClose: () => void;
  onSave: (settings: PageSettings) => void;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function formatSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PageSettingsModal({
  open,
  settings,
  onClose,
  onSave,
}: PageSettingsModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [title, setTitle] = useState(settings.title);
  const [slug, setSlug] = useState(settings.slug);
  const [seoDescription, setSeoDescription] = useState(settings.seoDescription);
  const [showHeader, setShowHeader] = useState(settings.showHeader);
  const [showFooter, setShowFooter] = useState(settings.showFooter);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const trimmedTitle = title.trim();
  const isSlugValid = SLUG_PATTERN.test(slug);
  const isValid =
    trimmedTitle.length > 0 && isSlugValid && seoDescription.length <= 160;

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    onSave({
      title: trimmedTitle,
      slug,
      seoDescription,
      showHeader,
      showFooter,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        dir="rtl"
        onSubmit={handleSave}
        className="relative w-full max-w-[520px] rounded-2xl border border-gray-100 bg-white p-6 text-right shadow-2xl shadow-black/20"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق إعدادات الصفحة"
          className="absolute left-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 id={titleId} className="text-xl font-semibold text-gray-950">
            إعدادات الصفحة
          </h2>
          <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
            اضبط بيانات الصفحة الأساسية وطريقة ظهورها في المعاينة.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="page-title"
              className="text-sm font-semibold text-gray-800"
            >
              عنوان الصفحة
            </label>
            <Input
              id="page-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              aria-required="true"
              aria-invalid={trimmedTitle.length === 0}
              className="h-11 rounded-xl bg-gray-50 px-3 text-right focus-visible:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="page-slug"
              className="text-sm font-semibold text-gray-800"
            >
              مكان الصفحة
            </label>
            <div className="flex overflow-hidden rounded-xl border border-input bg-gray-50 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <span className="flex h-11 items-center border-l border-input bg-white px-3 text-sm text-muted-foreground">
                /
              </span>
              <input
                id="page-slug"
                value={slug}
                onChange={(event) => setSlug(formatSlug(event.target.value))}
                aria-invalid={!isSlugValid}
                inputMode="url"
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-left text-sm outline-none"
              />
            </div>
            {!isSlugValid && (
              <p className="text-xs text-red-500">
                استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="page-seo-description"
              className="text-sm font-semibold text-gray-800"
            >
              وصف الصفحة (SEO)
            </label>
            <Textarea
              id="page-seo-description"
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              placeholder="وصف مختصر للصفحة يظهر في نتائج البحث"
              maxLength={160}
              aria-describedby="page-seo-helper page-seo-counter"
              className="min-h-28 resize-none rounded-xl bg-gray-50 px-3 py-3 text-right focus-visible:bg-white"
            />
            <div className="flex items-center justify-between gap-3 text-xs">
              <p id="page-seo-helper" className="text-muted-foreground">
                الطول الموصى به: 50-160 حرفًا
              </p>
              <span
                id="page-seo-counter"
                className={cn(
                  "font-medium",
                  seoDescription.length > 150
                    ? "text-amber-600"
                    : "text-muted-foreground",
                )}
              >
                {seoDescription.length}/160
              </span>
            </div>
          </div>

          <fieldset className="space-y-3 rounded-xl border border-border-color bg-gray-50 p-4">
            <legend className="px-1 text-sm font-semibold text-gray-800">
              الظهور
            </legend>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showHeader}
                onChange={(event) => setShowHeader(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--accent)]"
              />
              إظهار رأس الصفحة
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showFooter}
                onChange={(event) => setShowFooter(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--accent)]"
              />
              إظهار ذيل الصفحة
            </label>
          </fieldset>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            disabled={!isValid}
            className={cn(
              "min-w-28 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
              isValid
                ? "bg-gray-950 text-white hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            )}
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
}
