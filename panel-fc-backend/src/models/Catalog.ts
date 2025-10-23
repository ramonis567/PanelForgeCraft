import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    voltage_kv: string;
    icc_ka: string;
    function: string;
    load_current: string;
    load_power: string;
    main_equipment: string;
    sec_equipments: string[];
    width_mm: number;
    height_mm: number;
    depth_mm: number;
    weight_kg: number;
    structure: string;
    accessories?: string[];
}

const ProductSchema = new Schema<IProduct>(
    {
        voltage_kv: { type: String, required: true },
        icc_ka: { type: String, required: true },
        function: { type: String, required: true },
        load_current: { type: String },
        load_power: { type: String },
        main_equipment: { type: String },
        sec_equipments: { type: [String], default: [] },
        width_mm: Number,
        height_mm: Number,
        depth_mm: Number,
        weight_kg: Number,
        structure: { type: String, default: "PA4" },
        accessories: { type: [String], default: [] },
    },
    { 
        collection: "products" 
    }
);

ProductSchema.index({ structure: 1, voltage_kv: 1, icc_ka: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);
