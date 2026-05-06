import { create } from "zustand";
import { JsonValue, SectionType } from "@/lib/section-registry";

export type TabType = "pages" | "fonts" | "colors" | "css" | "sections";
export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface BuilderBlock {
  id: string; // Unique instance ID
  type: SectionType; // e.g., 'hero'
  data: Record<string, JsonValue>;
}

interface BuilderState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  blocks: BuilderBlock[];
  addBlock: (block: BuilderBlock) => void;
  insertBlock: (block: BuilderBlock, index: number) => void;
  moveBlock: (oldIndex: number, newIndex: number) => void;
  removeBlock: (id: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeTab: "sections",
  setActiveTab: (tab) => set({ activeTab: tab }),
  deviceMode: "desktop",
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  blocks: [],
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  insertBlock: (block, index) =>
    set((state) => {
      const newBlocks = [...state.blocks];
      newBlocks.splice(index, 0, block);
      return { blocks: newBlocks };
    }),
  moveBlock: (oldIndex, newIndex) =>
    set((state) => {
      const newBlocks = [...state.blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      return { blocks: newBlocks };
    }),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
}));
