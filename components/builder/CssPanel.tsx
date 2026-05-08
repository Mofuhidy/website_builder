"use client";

import { useBuilderStore } from "@/store/builder-store";

export function CssPanel() {
  const customCss = useBuilderStore((state) => state.customCss);
  const setCustomCss = useBuilderStore((state) => state.setCustomCss);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          أضف أكواد CSS مخصصة لتغيير تصميم الموقع بالكامل. يمكنك كتابة محددات الفئات (Classes) أو الوسوم (Tags).
        </p>
        <textarea
          dir="ltr"
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
          className="w-full flex-1 min-h-[300px] p-3 text-sm font-mono text-left bg-gray-50 border border-border-color rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none transition-all"
          placeholder={`/* اكتب هنا CSS الخاص بك */\n\n.my-custom-class {\n  background-color: red;\n}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
