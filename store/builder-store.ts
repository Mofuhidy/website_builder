import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { JsonValue, SectionType } from "@/lib/section-registry";

export type TabType = "pages" | "fonts" | "colors" | "css" | "sections";
export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface BuilderBlock {
  id: string;
  type: SectionType;
  data: Record<string, JsonValue>;
}

export interface ThemeColors {
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}

export interface PageSettings {
  title: string;
  slug: string;
  seoDescription: string;
  showHeader: boolean;
  showFooter: boolean;
}

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  title: "الرئيسية",
  slug: "home",
  seoDescription: "",
  showHeader: true,
  showFooter: true,
};

export interface Snapshot {
  blocks: BuilderBlock[];
  themeColors: ThemeColors;
  customCss: string;
  pageSettings: PageSettings;
  hasPage: boolean;
}

interface BuilderState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  blocks: BuilderBlock[];
  isDirty: boolean;
  markSaved: () => void;
  lastAddedBlockId: string | null;
  clearLastAdded: () => void;
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  editingBlockId: string | null;
  setEditingBlock: (id: string | null) => void;
  addBlock: (block: BuilderBlock) => void;
  insertBlock: (block: BuilderBlock, index: number) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (oldIndex: number, newIndex: number) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  removeBlock: (id: string) => void;
  setBlocks: (blocks: BuilderBlock[]) => void;
  updateBlockData: (id: string, data: Record<string, JsonValue>) => void;
  themeColors: ThemeColors;
  setThemeColor: (key: keyof ThemeColors, value: string) => void;
  setThemeColors: (colors: ThemeColors) => void;
  customCss: string;
  setCustomCss: (css: string) => void;
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
  hasPage: boolean;
  setHasPage: (hasPage: boolean) => void;
  createPage: () => void;
  removePage: () => void;

  past: Snapshot[];
  future: Snapshot[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

function pushSnapshot(state: BuilderState): Partial<BuilderState> {
  const snapshot: Snapshot = {
    blocks: state.blocks,
    themeColors: state.themeColors,
    customCss: state.customCss,
    pageSettings: state.pageSettings,
    hasPage: state.hasPage,
  };
  return {
    past: [...state.past, snapshot],
    future: [],
    isDirty: true,
  };
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      activeTab: "sections",
      setActiveTab: (tab) => set({ activeTab: tab }),
      deviceMode: "desktop",
      setDeviceMode: (mode) => set({ deviceMode: mode }),
      blocks: [],
      isDirty: false,
      markSaved: () => set({ isDirty: false }),
      lastAddedBlockId: null,
      clearLastAdded: () => set({ lastAddedBlockId: null }),
      selectedBlockId: null,
      selectBlock: (id) => set({ selectedBlockId: id }),
      editingBlockId: null,
      setEditingBlock: (id) => set({ editingBlockId: id }),
      customCss: "",
      setCustomCss: (css) =>
        set((state) => ({
          ...pushSnapshot(state),
          customCss: css,
        })),

      past: [],
      future: [],
      canUndo: () => {
        const { past } = get();
        return past && past.length > 0;
      },
      canRedo: () => {
        const { future } = get();
        return future && future.length > 0;
      },

      undo: () =>
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, state.past.length - 1);
          const currentSnapshot: Snapshot = {
            blocks: state.blocks,
            themeColors: state.themeColors,
            customCss: state.customCss,
            pageSettings: state.pageSettings,
            hasPage: state.hasPage,
          };
          return {
            past: newPast,
            future: [currentSnapshot, ...state.future],
            blocks: previous.blocks,
            themeColors: previous.themeColors,
            customCss: previous.customCss,
            pageSettings: previous.pageSettings,
            hasPage: previous.hasPage,
            isDirty: true,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          const currentSnapshot: Snapshot = {
            blocks: state.blocks,
            themeColors: state.themeColors,
            customCss: state.customCss,
            pageSettings: state.pageSettings,
            hasPage: state.hasPage,
          };
          return {
            past: [...state.past, currentSnapshot],
            future: newFuture,
            blocks: next.blocks,
            themeColors: next.themeColors,
            customCss: next.customCss,
            pageSettings: next.pageSettings,
            hasPage: next.hasPage,
            isDirty: true,
          };
        }),

      themeColors: {
        accent: "#f05151",
        background: "#ffffff",
        foreground: "#111827",
        muted: "#f9fafb",
      },
      setThemeColor: (key, value) =>
        set((state) => ({
          ...pushSnapshot(state),
          themeColors: { ...state.themeColors, [key]: value },
        })),
      setThemeColors: (colors) =>
        set((state) => ({
          ...pushSnapshot(state),
          themeColors: colors,
        })),
      pageSettings: DEFAULT_PAGE_SETTINGS,
      setPageSettings: (settings) =>
        set((state) => ({
          ...pushSnapshot(state),
          pageSettings: settings,
        })),
      hasPage: true,
      setHasPage: (hasPage) =>
        set((state) => ({
          ...pushSnapshot(state),
          hasPage,
        })),
      createPage: () =>
        set((state) => ({
          ...pushSnapshot(state),
          hasPage: true,
          pageSettings: DEFAULT_PAGE_SETTINGS,
        })),
      removePage: () =>
        set((state) => ({
          ...pushSnapshot(state),
          hasPage: false,
          selectedBlockId: null,
          editingBlockId: null,
        })),

      addBlock: (block) =>
        set((state) => ({ ...pushSnapshot(state), blocks: [...state.blocks, block], lastAddedBlockId: block.id })),

      setBlocks: (blocks) => set((state) => ({ ...pushSnapshot(state), blocks })),

      insertBlock: (block, index) =>
        set((state) => {
          const newBlocks = [...state.blocks];
          newBlocks.splice(index, 0, block);
          return { ...pushSnapshot(state), blocks: newBlocks, lastAddedBlockId: block.id };
        }),

      duplicateBlock: (id) =>
        set((state) => {
          const idx = state.blocks.findIndex((b) => b.id === id);
          if (idx === -1) return state;
          const original = state.blocks[idx];
          const clone: BuilderBlock = {
            ...original,
            id: `${original.type}-${Date.now()}`,
            data: structuredClone(original.data),
          };
          const newBlocks = [...state.blocks];
          newBlocks.splice(idx + 1, 0, clone);
          return { ...pushSnapshot(state), blocks: newBlocks, lastAddedBlockId: clone.id };
        }),

      moveBlock: (oldIndex, newIndex) =>
        set((state) => {
          const newBlocks = [...state.blocks];
          const [movedBlock] = newBlocks.splice(oldIndex, 1);
          newBlocks.splice(newIndex, 0, movedBlock);
          return { ...pushSnapshot(state), blocks: newBlocks };
        }),

      moveBlockUp: (id) =>
        set((state) => {
          const idx = state.blocks.findIndex((b) => b.id === id);
          if (idx <= 0) return state;
          const newBlocks = [...state.blocks];
          [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
          return { ...pushSnapshot(state), blocks: newBlocks };
        }),

      moveBlockDown: (id) =>
        set((state) => {
          const idx = state.blocks.findIndex((b) => b.id === id);
          if (idx === -1 || idx >= state.blocks.length - 1) return state;
          const newBlocks = [...state.blocks];
          [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
          return { ...pushSnapshot(state), blocks: newBlocks };
        }),

      removeBlock: (id) =>
        set((state) => ({
          ...pushSnapshot(state),
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
          editingBlockId: state.editingBlockId === id ? null : state.editingBlockId,
        })),

      updateBlockData: (id, data) =>
        set((state) => ({
          ...pushSnapshot(state),
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, data } : b)),
        })),
    }),
    {
      name: "builder-storage-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        blocks: state.blocks,
        deviceMode: state.deviceMode,
        activeTab: state.activeTab,
        themeColors: state.themeColors,
        customCss: state.customCss,
        pageSettings: state.pageSettings,
        hasPage: state.hasPage,
        editingBlockId: state.editingBlockId,
      }),
    },
  ),
);
