import type { PanelConfiguration } from "../models/panel";

const STORAGE_KEY = "panelforge.config.v1";
const CURRENT_KEY = "panelforge.currentId";

export function loadAllPanels(): PanelConfiguration[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        } else {
			return JSON.parse(raw) as PanelConfiguration[];
		}
    } catch {
        return [];
    }
}

export function loadPanel(id: string): PanelConfiguration | undefined {
    const panels = loadAllPanels();
    return panels.find(p => p.id === id);
}

export function saveAllPanels(panels: PanelConfiguration[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
}

export function savePanel(panel: PanelConfiguration) {
	const panels = loadAllPanels();
	const idx = panels.findIndex(p => p.id === panel.id);

	// console.log(panels)

	if (idx >= 0) {
		panels[idx] = panel;
	} else {
		panels.push(panel);
	}

	saveAllPanels(panels);
}

export function deletePanel(id: string) {
	const panels = loadAllPanels().filter(p => p.id !== id);
	saveAllPanels(panels);
}

export function getCurrentPanelId(): string | null {
	return localStorage.getItem(CURRENT_KEY);
}

export function clearPanelConfig(id: string) {
	const panels = loadAllPanels();
	const idx = panels.findIndex(p => p.id === id);

	if (idx >= 0) {
		panels[idx] = { id: panels[idx].id } as PanelConfiguration;
		saveAllPanels(panels);
	}
}