import mongoose, { Schema, Document } from "mongoose";

export interface IModule {
    moduleId: string;
    name: string;
    width_mm: number;
    height_mm: number;
    depth_mm: number;
    weight_kg: number;
}

export interface IColumn {
    columnId: string;
    columnTag: string;
    columnsFunction: string;
    mainEquipment: string;
    secEquipments: string[];
    current_load: string;
    power_load: string;
    dimensions: {
        height: number;
        width: number;
        depth: number;
        weight: number;
    };
    modules: IModule[];
}

export interface IPanel extends Document {
    name: string;
    description?: string;
    voltage_kv: string;
    icc_ka: string;
    structure: string;
    columns: IColumn[];
    metadata: {
        createdBy: mongoose.Types.ObjectId;
        createdAt: Date;
        lastModifiedAt: Date;
    };
}

const ModuleSchema = new Schema<IModule>(
    {
        moduleId: { type: String, required: true },
        name: { type: String, required: true },
        width_mm: Number,
        height_mm: Number,
        depth_mm: Number,
        weight_kg: Number,
    },
    { _id: false }
);

const ColumnSchema = new Schema<IColumn>(
    {
        columnId: { type: String, required: true },
        columnTag: { type: String, required: true },
        columnsFunction: { type: String, required: true },
        mainEquipment: { type: String },
        secEquipments: { type: [String], default: [] },
        current_load: { type: String },
        power_load: { type: String },
        dimensions: {
        height: Number,
        width: Number,
        depth: Number,
        weight: Number,
        },
        modules: { type: [ModuleSchema], default: [] },
    },
    { _id: false }
);

const PanelSchema = new Schema<IPanel>(
    {
        name: { type: String, required: true },
        description: { type: String },
        voltage_kv: { type: String, required: true },
        icc_ka: { type: String, required: true },
        structure: { type: String, required: true },
        columns: { type: [ColumnSchema], default: [] },
        metadata: {
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        lastModifiedAt: { type: Date, default: Date.now },
        },
    },
    { collection: "panels" }
);

export default mongoose.model<IPanel>("Panel", PanelSchema);
