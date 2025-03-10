import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import todoRoutes from "./routes/todoRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

export default app;
