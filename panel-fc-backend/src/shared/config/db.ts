import mongoose from 'mongoose';
import { ENV } from './env'

export const connectDB = async () => {
    const uri = ENV.MONGO_URI
    
    await mongoose.connect(uri, {dbName: 'PanelForgeCraft'});
    console.log("MongoDB connected successfully");
}