export interface PanelModule {
    moduleId: string;
    name: string;
    height: number;
    width: number;
    depth: number;
    weight: number;
}

interface ColumnDimensions {
    height: number;
    width: number;
    depth: number;
    weight: number;
}

export interface PanelColumn {
    columnId: string;
    columnTag: string;
    columnFunction: string;
    current_load: string;
    power_load_kw: string;    
    main_equipment: string;
    secondary_equipments: string[];
    dimensions: ColumnDimensions;
    position: number;
    modules: PanelModule[];
}

interface PanelMetadata {
    createdBy: string;
    createdAt: Date;
    lastModifiedAt: Date;
}

export interface PanelConfiguration {
    id: string;
    name: string;
    tensaoNominal: string;
    icc: string;
    structure: string;
    description?: string;
    columns: PanelColumn[];
    metadata: PanelMetadata;
}

export const renumberColumns = (cols: PanelColumn[]) =>
    cols.map((c, idx) => ({ ...c, position: idx + 1}));