import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { JsonValue, SectionType } from "@/lib/section-registry";
import {
  normalizeCustomCss,
  normalizeFontFamily,
  normalizeImportedBlocks,
  normalizePageSettings,
} from "@/lib/builder-utils";

export type TabType = "pages" | "fonts" | "colors" | "css" | "sections";
export type DeviceMode = "desktop" | "tablet" | "mobile";
export type FontFamily = "system" | "cairo" | "tajawal" | "almarai";

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

export const DEFAULT_THEME_COLORS: ThemeColors = {
  accent: "#f05151",
  background: "#ffffff",
  foreground: "#111827",
  muted: "#f9fafb",
};

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

export const DEFAULT_FONT_FAMILY: FontFamily = "system";

// Exporting types used by utils
export interface Snapshot {
  blocks: BuilderBlock[];
  themeColors: ThemeColors;
  customCss: string;
  pageSettings: PageSettings;
  hasPage: boolean;
  fontFamily: FontFamily;
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
  applyImportedState: (payload: Snapshot) => void;
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
  setPageVisibility: (visibility: Pick<PageSettings, "showHeader" | "showFooter">) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  hasPage: boolean;
  setHasPage: (hasPage: boolean) => void;
  createPage: () => void;
  removePage: () => void;
  previewResetKey: number;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;

  past: Snapshot[];
  future: Snapshot[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

function keepBlockSelection(
  blockId: string | null,
  blocks: BuilderBlock[],
) {
  return blockId !== null && blocks.some((block) => block.id === blockId) ? blockId : null;
}

function pushSnapshot(state: BuilderState): Partial<BuilderState> {
  const snapshot: Snapshot = {
    blocks: state.blocks,
    themeColors: state.themeColors,
    customCss: state.customCss,
    pageSettings: state.pageSettings,
    hasPage: state.hasPage,
    fontFamily: state.fontFamily,
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
          customCss: normalizeCustomCss(css),
        })),
      applyImportedState: (payload) =>
        set((state) => ({
          ...pushSnapshot(state),
          blocks: payload.blocks,
          themeColors: payload.themeColors,
          customCss: payload.customCss,
          pageSettings: payload.pageSettings,
          hasPage: payload.hasPage,
          fontFamily: payload.fontFamily,
          selectedBlockId: null,
          editingBlockId: null,
          lastAddedBlockId: null,
          previewResetKey: state.previewResetKey + 1,
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
            fontFamily: state.fontFamily,
          };
          return {
            past: newPast,
            future: [currentSnapshot, ...state.future],
            blocks: previous.blocks,
            themeColors: previous.themeColors,
            customCss: previous.customCss,
            pageSettings: previous.pageSettings,
            hasPage: previous.hasPage,
            fontFamily: previous.fontFamily,
            selectedBlockId: keepBlockSelection(state.selectedBlockId, previous.blocks),
            editingBlockId: keepBlockSelection(state.editingBlockId, previous.blocks),
            lastAddedBlockId: null,
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
            fontFamily: state.fontFamily,
          };
          return {
            past: [...state.past, currentSnapshot],
            future: newFuture,
            blocks: next.blocks,
            themeColors: next.themeColors,
            customCss: next.customCss,
            pageSettings: next.pageSettings,
            hasPage: next.hasPage,
            fontFamily: next.fontFamily,
            selectedBlockId: keepBlockSelection(state.selectedBlockId, next.blocks),
            editingBlockId: keepBlockSelection(state.editingBlockId, next.blocks),
            lastAddedBlockId: null,
            isDirty: true,
          };
        }),

      themeColors: DEFAULT_THEME_COLORS,
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
          pageSettings: normalizePageSettings(settings),
        })),
      setPageVisibility: (visibility) =>
        set((state) => ({
          ...pushSnapshot(state),
          pageSettings: normalizePageSettings({
            ...state.pageSettings,
            ...visibility,
          }),
        })),
      fontFamily: DEFAULT_FONT_FAMILY,
      setFontFamily: (fontFamily) =>
        set((state) => ({
          ...pushSnapshot(state),
          fontFamily,
        })),
      hasPage: true,
      setHasPage: (hasPage) =>
        set((state) => ({
          ...pushSnapshot(state),
          hasPage,
        })),
      previewResetKey: 0,
      createPage: () =>
        set((state) => ({
          ...pushSnapshot(state),
          blocks: [],
          themeColors: DEFAULT_THEME_COLORS,
          customCss: "",
          fontFamily: DEFAULT_FONT_FAMILY,
          hasPage: true,
          pageSettings: DEFAULT_PAGE_SETTINGS,
          selectedBlockId: null,
          editingBlockId: null,
          lastAddedBlockId: null,
          previewResetKey: state.previewResetKey + 1,
        })),
      removePage: () =>
        set((state) => ({
          ...pushSnapshot(state),
          hasPage: false,
          selectedBlockId: null,
          editingBlockId: null,
          lastAddedBlockId: null,
          previewResetKey: state.previewResetKey + 1,
        })),
      sidebarWidth: 320,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),

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
        fontFamily: state.fontFamily,
        editingBlockId: state.editingBlockId,
        sidebarWidth: state.sidebarWidth,
      }),
      merge: (persisted, current) => {
        const persistedState =
          persisted !== null && typeof persisted === "object" && !Array.isArray(persisted)
            ? persisted as Partial<BuilderState>
            : {};

        return {
          ...current,
          ...persistedState,
          blocks: normalizeImportedBlocks(persistedState.blocks).blocks,
          customCss: normalizeCustomCss(persistedState.customCss),
          pageSettings: normalizePageSettings(persistedState.pageSettings),
          hasPage:
            typeof persistedState.hasPage === "boolean"
              ? persistedState.hasPage
              : current.hasPage,
          fontFamily: normalizeFontFamily(persistedState.fontFamily),
        };
      },
    },
  ),
);
