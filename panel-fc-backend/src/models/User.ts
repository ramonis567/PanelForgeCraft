import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    company?: string;
    role: "Admin" | "IntUser" | "ExtUser";
    password_hash: string;
    created_at: Date;
    last_login?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        company: { type: String },
        role: { type: String, enum: ["Admin", "IntUser", "ExtUser"], required: true },
        password_hash: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        last_login: { type: Date },
    },
    {
        collection: "users",
    }
);

export default mongoose.model<IUser>("User", userSchema);
