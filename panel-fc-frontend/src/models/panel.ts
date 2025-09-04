interface PanelModule {
    moduleId: string;
    name: string;
    size: number;
}

interface ColumnDimensions {
    height: number;
    width: number;
    depth: number;
}

export interface PanelColumn {
    columnId: string;
    type: string;
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
    description?: string;
    columns: PanelColumn[];
    metadata: PanelMetadata;
}