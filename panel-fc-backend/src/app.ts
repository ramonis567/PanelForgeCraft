import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./shared/routes";
import { connectDB } from "./shared/config/db";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

connectDB();

app.use("/api", routes);

export default app;
