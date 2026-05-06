"use client";

import { useBuilderStore } from "@/store/builder-store";

export function InspectorPanel() {
  const { activeTab } = useBuilderStore();

  let title = "";
  let content = null;

  switch (activeTab) {
    case "pages":
      title = "الصفحات";
      content = <div className="text-sm text-muted-foreground">إدارة صفحات الموقع...</div>;
      break;
    case "fonts":
      title = "الخطوط";
      content = <div className="text-sm text-muted-foreground">إعدادات الخطوط...</div>;
      break;
    case "colors":
      title = "الألوان";
      content = <div className="text-sm text-muted-foreground">إعدادات الألوان...</div>;
      break;
    case "css":
      title = "CSS مخصص";
      content = <div className="text-sm text-muted-foreground">أضف كود CSS...</div>;
      break;
    case "sections":
      title = "الأقسام";
      content = <div className="text-sm text-muted-foreground">مكتبة الأقسام...</div>;
      break;
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b border-border-color">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {content}
      </div>
    </div>
  );
}
