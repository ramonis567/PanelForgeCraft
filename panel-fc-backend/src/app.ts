import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./shared/routes";
import cookieParser from "cookie-parser";
import { connectDB } from "./shared/config/db";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(morgan("dev"));

connectDB();

app.use("/api", routes);

export default app;
