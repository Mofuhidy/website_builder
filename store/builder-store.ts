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
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
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
      
      themeColors: {
        accent: "#f05151",
        background: "#ffffff",
        foreground: "#111827",
        muted: "#f9fafb",
      },
      setThemeColor: (key, value) =>
        set((state) => ({
          themeColors: { ...state.themeColors, [key]: value },
          isDirty: true,
        })),

      addBlock: (block) =>
        set((state) => ({ blocks: [...state.blocks, block], isDirty: true, lastAddedBlockId: block.id })),

      setBlocks: (blocks) => set({ blocks, isDirty: true }),

      insertBlock: (block, index) =>
        set((state) => {
          const newBlocks = [...state.blocks];
          newBlocks.splice(index, 0, block);
          return { blocks: newBlocks, isDirty: true, lastAddedBlockId: block.id };
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
          return { blocks: newBlocks, isDirty: true, lastAddedBlockId: clone.id };
        }),

      moveBlock: (oldIndex, newIndex) =>
        set((state) => {
          const newBlocks = [...state.blocks];
          const [movedBlock] = newBlocks.splice(oldIndex, 1);
          newBlocks.splice(newIndex, 0, movedBlock);
          return { blocks: newBlocks, isDirty: true };
        }),

      moveBlockUp: (id) =>
        set((state) => {
          const idx = state.blocks.findIndex((b) => b.id === id);
          if (idx <= 0) return state;
          const newBlocks = [...state.blocks];
          [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
          return { blocks: newBlocks, isDirty: true };
        }),

      moveBlockDown: (id) =>
        set((state) => {
          const idx = state.blocks.findIndex((b) => b.id === id);
          if (idx === -1 || idx >= state.blocks.length - 1) return state;
          const newBlocks = [...state.blocks];
          [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
          return { blocks: newBlocks, isDirty: true };
        }),

      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
          isDirty: true,
        })),

      updateBlockData: (id, data) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, data } : b)),
          isDirty: true,
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
      }),
    },
  ),
);
