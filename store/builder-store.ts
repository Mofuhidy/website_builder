import { create } from "zustand";
import { JsonValue, SectionType } from "@/lib/section-registry";

export type TabType = "pages" | "fonts" | "colors" | "css" | "sections";
export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface BuilderBlock {
  id: string;
  type: SectionType;
  data: Record<string, JsonValue>;
}

interface BuilderState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  blocks: BuilderBlock[];
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
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeTab: "sections",
  setActiveTab: (tab) => set({ activeTab: tab }),
  deviceMode: "desktop",
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  blocks: [],
  selectedBlockId: null,
  selectBlock: (id) => set({ selectedBlockId: id }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  setBlocks: (blocks) => set({ blocks }),
  insertBlock: (block, index) =>
    set((state) => {
      const newBlocks = [...state.blocks];
      newBlocks.splice(index, 0, block);
      return { blocks: newBlocks };
    }),
  duplicateBlock: (id) =>
    set((state) => {
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return state;
      const original = state.blocks[idx];
      const clone: BuilderBlock = {
        ...original,
        id: `${original.type}-${Date.now()}`,
        data: { ...original.data },
      };
      const newBlocks = [...state.blocks];
      newBlocks.splice(idx + 1, 0, clone);
      return { blocks: newBlocks };
    }),
  moveBlock: (oldIndex, newIndex) =>
    set((state) => {
      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      return { blocks: newBlocks };
    }),
  moveBlockUp: (id) =>
    set((state) => {
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return state;
      const newBlocks = [...state.blocks];
      [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
      return { blocks: newBlocks };
    }),
  moveBlockDown: (id) =>
    set((state) => {
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx === -1 || idx >= state.blocks.length - 1) return state;
      const newBlocks = [...state.blocks];
      [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
      return { blocks: newBlocks };
    }),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    })),
  updateBlockData: (id, data) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, data } : b)),
    })),
}));

