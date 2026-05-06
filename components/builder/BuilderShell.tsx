"use client";

export function BuilderShell() {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden text-foreground">
      {/* Top Toolbar Placeholder */}
      <header className="h-14 border-b border-border-color bg-white flex items-center justify-between px-4 shrink-0">
        <div className="font-semibold">شريط الأدوات</div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden">
        {/* Right Rail / Inspector Placeholder */}
        <aside className="w-80 bg-white border-l border-border-color flex shrink-0">
          {/* Vertical Tabs Rail (Far Right in RTL) */}
          <div className="w-16 flex flex-col items-center py-4 gap-4 bg-white shrink-0 border-l border-border-color">
            <button
              type="button"
              className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => {}}>
              <span>تبويب</span>
            </button>
          </div>
          {/* Inspector Panel */}
          <div className="flex-1 p-4 overflow-auto">
            <h2 className="font-semibold mb-4">لوحة الخصائص</h2>
            <div className="text-sm text-muted-foreground">المحتوى...</div>
          </div>
        </aside>

        {/* Canvas Area Placeholder */}
        <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
          <div className="w-full max-w-5xl min-h-[800px] bg-white rounded-lg shadow-sm border border-border-color flex items-center justify-center text-muted-foreground">
            مساحة العمل
          </div>
        </div>
      </main>
    </div>
  );
}
