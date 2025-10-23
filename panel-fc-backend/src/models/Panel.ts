import mongoose, { Schema, Document } from "mongoose";

interface IModule {
    moduleId: string;
    name: string;
    height?: number;
    width?: number;
    depth?: number;
    weight?: number;
}

interface IColumn {
    columnId: string;
    columnTag: string;
    columnsFunction: string;
    mainEquipment: string;
    secEquipments: string[];
    current_load: string;
    power_load: string;
    dimensions?: Record<string, any>;
    modules: IModule[];
}

export interface IPanel extends Document {
    name: string;
    description?: string;
    voltage_kv: string;
    icc_ka: string;
    structure: string;
    columns: IColumn[];
}

const ModuleSchema = new Schema<IModule>({
    moduleId: String,
    name: String,
    height: Number,
    width: Number,
    depth: Number,
    weight: Number,
});

const ColumnSchema = new Schema<IColumn>({
    columnId: String,
    columnTag: String,
    columnsFunction: String,
    mainEquipment: String,
    secEquipments: [String],
    current_load: String,
    power_load: String,
    dimensions: Schema.Types.Mixed,
    modules: [ModuleSchema],
});

const PanelSchema = new Schema<IPanel>(
    {
        name: { type: String, required: true },
        description: String,
        voltage_kv: String,
        icc_ka: String,
        structure: String,
        columns: [ColumnSchema],
    },
    { 
        collection: "panels"
    }
);

export default mongoose.model<IPanel>("Panel", PanelSchema);
