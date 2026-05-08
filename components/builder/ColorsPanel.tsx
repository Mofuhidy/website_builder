"use client";

import { useBuilderStore, ThemeColors } from "@/store/builder-store";

export function ColorsPanel() {
  const themeColors = useBuilderStore((s) => s.themeColors);
  const setThemeColor = useBuilderStore((s) => s.setThemeColor);

  const colors: { key: keyof ThemeColors; label: string; desc: string }[] = [
    { key: "accent", label: "اللون الأساسي", desc: "يستخدم للأزرار والروابط والعناصر البارزة" },
    { key: "background", label: "لون الخلفية", desc: "اللون العام لخلفية الموقع" },
    { key: "foreground", label: "لون النص الرئيسي", desc: "لون النصوص الأساسية في الموقع" },
    { key: "muted", label: "الخلفيات الثانوية", desc: "خلفية البطاقات أو الأقسام المتبادلة" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {colors.map(({ key, label, desc }) => (
        <div key={key} className="flex flex-col gap-2 border border-border-color rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor={`color-${key}`} className="text-sm font-semibold text-gray-800">
                {label}
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Color indicator circle */}
              <div 
                className="w-10 h-10 rounded-full border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
                style={{ backgroundColor: themeColors[key] }}
              >
                <input
                  id={`color-${key}`}
                  type="color"
                  value={themeColors[key]}
                  onChange={(e) => setThemeColor(key, e.target.value)}
                  className="opacity-0 w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={themeColors[key]}
              onChange={(e) => setThemeColor(key, e.target.value)}
              className="text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1 w-20 uppercase"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
