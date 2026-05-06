import { create } from "zustand";

export type TabType = "pages" | "fonts" | "colors" | "css" | "sections";
export type DeviceMode = "desktop" | "mobile";

interface BuilderState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeTab: "sections",
  setActiveTab: (tab) => set({ activeTab: tab }),
  deviceMode: "desktop",
  setDeviceMode: (mode) => set({ deviceMode: mode }),
}));
