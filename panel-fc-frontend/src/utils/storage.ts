import type { PanelConfiguration } from "../models/panel";

const STORAGE_KEY = "panelforge.config.v1";

export function savePanelConfig(config: PanelConfiguration) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    // remove on production:
    console.log(e);    
  }
}

export function loadPanelConfig(): PanelConfiguration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PanelConfiguration;

    if (parsed?.metadata) {
      const m = parsed.metadata as any;
      if (m.createdAt && typeof m.createdAt === "string") m.createdAt = new Date(m.createdAt);
      if (m.lastModifiedAt && typeof m.lastModifiedAt === "string") m.lastModifiedAt = new Date(m.lastModifiedAt);
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearPanelConfig() {
  localStorage.removeItem(STORAGE_KEY);
}