import { customAlphabet } from "nanoid";
import type { PanelConfiguration } from "../models/panel";

const alphabetForId = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generatePanelId = () => {
    const nanoid = customAlphabet(alphabetForId, 5);
    return `P-${nanoid()}`;
}

const createBlankPanel = (): PanelConfiguration => {
    return {
        id: generatePanelId(),
        name: '',
        description: '',
        tensaoNominal: '',
        icc: '',
        columns: [],
        metadata: {
            createdBy: 'User',
            createdAt: new Date(),
            lastModifiedAt: new Date(),
        }
    };
}

export { generatePanelId, createBlankPanel };