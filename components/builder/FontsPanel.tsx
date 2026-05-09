"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import {
  type FontFamily,
  useBuilderStore,
} from "@/store/builder-store";
import { cn } from "@/lib/cn";

const FONT_OPTIONS: {
  id: FontFamily;
  label: string;
  description: string;
  preview: string;
  fontFamily: string;
}[] = [
  {
    id: "system",
    label: "System",
    description: "خط النظام الافتراضي",
    preview: "واجهة عربية واضحة",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    id: "cairo",
    label: "Cairo",
    description: "خط عربي هندسي وحديث",
    preview: "واجهة عربية واضحة",
    fontFamily: "var(--font-cairo), system-ui, sans-serif",
  },
  {
    id: "tajawal",
    label: "Tajawal",
    description: "خط بسيط ومناسب للواجهات",
    preview: "واجهة عربية واضحة",
    fontFamily: "var(--font-tajawal), system-ui, sans-serif",
  },
  {
    id: "almarai",
    label: "Almarai",
    description: "خط هادئ ومقروء للمحتوى",
    preview: "واجهة عربية واضحة",
    fontFamily: "var(--font-almarai), system-ui, sans-serif",
  },
];

export function FontsPanel() {
  const fontFamily = useBuilderStore((state) => state.fontFamily);
  const setFontFamily = useBuilderStore((state) => state.setFontFamily);

  return (
    <section aria-labelledby="fonts-panel-title" className="space-y-4">
      <div>
        <h3 id="fonts-panel-title" className="text-base font-semibold">
          الخطوط
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          اختر خط المعاينة فقط دون تغيير واجهة المحرر.
        </p>
      </div>

      <div className="space-y-3">
        {FONT_OPTIONS.map((option) => {
          const isActive = option.id === fontFamily;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFontFamily(option.id)}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-4 text-right shadow-sm transition-all",
                isActive
                  ? "border-accent/45 bg-accent/5"
                  : "border-border-color bg-white hover:border-accent/30 hover:bg-gray-50",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold",
                  isActive
                    ? "border-accent bg-white text-accent"
                    : "border-border-color bg-gray-50 text-gray-500",
                )}
                style={{ fontFamily: option.fontFamily }}
              >
                أ
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-950">
                    {option.label}
                  </span>
                  {isActive && (
                    <CheckIcon className="h-4 w-4 shrink-0 text-accent" />
                  )}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {option.description}
                </span>
                <span
                  className="mt-3 block text-lg text-gray-800"
                  style={{ fontFamily: option.fontFamily }}
                >
                  {option.preview}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
