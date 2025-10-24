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
    totalColumns: number;
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
            height: { type: Number, min: 1 },
            width: { type: Number, min: 1 },
            depth: { type: Number, min: 1 },
            weight: { type: Number, min: 0 },
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
        totalColumns: { type: Number, default: 0 },
        metadata: {
            createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
            createdAt: { type: Date, default: Date.now },
            lastModifiedAt: { type: Date, default: Date.now },
        },
    },
    { 
        collection: "panels", 
        timestamps: {
            createdAt: "metadata.createdAt",
            updatedAt: "metadata.lastModifiedAt",
        },
    }
);

// Hook to update totalColumns and lastModifiedAt before saving
PanelSchema.pre("save", function (next) {
    this.metadata.lastModifiedAt = new Date();
    this.totalColumns = this.columns.length;
    next();
});


PanelSchema.pre("findOneAndUpdate", function (next) {
  const update: any = this.getUpdate() || {};

  const $set = update.$set ?? update;
  if (Array.isArray($set.columns)) {
    $set.totalColumns = $set.columns.length;
  }

  if (update.$set) update.$set = $set;
  else Object.assign(update, $set);

  next();
});

// Hook to populate fake user data automatically
// PanelSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: "metadata.createdBy",
//         select: "name email role", // example projection
//         options: { strictPopulate: false }, // avoid error if User model not present
//     });
//     next();
// });

export default mongoose.model<IPanel>("Panel", PanelSchema);
