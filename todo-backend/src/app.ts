import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Correct usage of routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

export default app;
