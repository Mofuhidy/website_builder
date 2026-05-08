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

export interface Snapshot {
  blocks: BuilderBlock[];
  themeColors: ThemeColors;
  customCss: string;
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
  customCss: string;
  setCustomCss: (css: string) => void;

  past: Snapshot[];
  future: Snapshot[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

// Helper to push history state before changes
function pushSnapshot(state: BuilderState): Partial<BuilderState> {
  const snapshot: Snapshot = {
    blocks: state.blocks,
    themeColors: state.themeColors,
    customCss: state.customCss,
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
          };
          return {
            past: newPast,
            future: [currentSnapshot, ...state.future],
            blocks: previous.blocks,
            themeColors: previous.themeColors,
            customCss: previous.customCss,
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
          };
          return {
            past: [...state.past, currentSnapshot],
            future: newFuture,
            blocks: next.blocks,
            themeColors: next.themeColors,
            customCss: next.customCss,
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
      }),
    },
  ),
);
