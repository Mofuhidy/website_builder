"use client";

import { useBuilderStore, TabType } from "@/store/builder-store";
import {
  WindowIcon,
  LanguageIcon,
  SwatchIcon,
  CodeBracketIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "pages", label: "الصفحات", icon: <WindowIcon className="w-5 h-5" /> },
  { id: "fonts", label: "الخطوط", icon: <LanguageIcon className="w-5 h-5" /> },
  { id: "colors", label: "الألوان", icon: <SwatchIcon className="w-5 h-5" /> },
  { id: "css", label: "CSS", icon: <CodeBracketIcon className="w-5 h-5" /> },
  { id: "sections", label: "الأقسام", icon: <Squares2X2Icon className="w-5 h-5" /> },
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
