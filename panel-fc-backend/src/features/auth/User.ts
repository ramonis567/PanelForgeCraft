import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    name: string;
    email: string;
    company?: string;
    role: "Admin" | "Engineer" | "Viewer";
    password_hash: string;
    created_at: Date;
    last_login?: Date;
    activated: boolean;
    comparePassword(candidate: string): Promise<boolean>;

    // virtual write-only:
    password?: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        company: { type: String },
        role: { type: String, enum: ["Admin", "Engineer", "Viewer"], default: "Viewer" },
        password_hash: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        last_login: { type: Date },
        activated: { type: Boolean, default: true },
    },
    {
        collection: "users",
        toJSON: {
            transform: (_doc, ret) => {
                delete (ret as any).password_hash;
                return ret;
            },
        },
    }
);

// Write-only virtual: set plain password -> store bcrypt hash in password_hash
UserSchema.virtual("password")
.set(function (this: IUser, plain: string) {
    const salt = bcrypt.genSaltSync(10);
    this.password_hash = bcrypt.hashSync(plain, salt);
});

// Instance method: compare password
UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password_hash);
};

export default mongoose.model<IUser>("User", UserSchema);
