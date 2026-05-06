"use client";

import { useBuilderStore, TabType } from "@/store/builder-store";
import { LayoutTemplate, Type, Palette, Code, Blocks } from "lucide-react";
import { cn } from "@/lib/cn";

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "pages", label: "الصفحات", icon: <LayoutTemplate className="w-5 h-5" /> },
  { id: "fonts", label: "الخطوط", icon: <Type className="w-5 h-5" /> },
  { id: "colors", label: "الألوان", icon: <Palette className="w-5 h-5" /> },
  { id: "css", label: "CSS", icon: <Code className="w-5 h-5" /> },
  { id: "sections", label: "الأقسام", icon: <Blocks className="w-5 h-5" /> },
];

export function RightRail() {
  const activeTab = useBuilderStore((state) => state?.activeTab);
  const setActiveTab = useBuilderStore((state) => state?.setActiveTab);

  return (
    <div className="w-20 flex flex-col items-center py-4 gap-4 bg-white shrink-0 border-l border-border-color">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-colors",
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
            )}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
