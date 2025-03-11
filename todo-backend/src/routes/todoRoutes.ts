import express, { RequestHandler } from "express";
import {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
} from "../controllers/todoController";

const router = express.Router();

// ✅ Create a new Todo
router.post("/", createTodo as RequestHandler);

// ✅ Get all Todos created by a specific user
router.get("/user/:userId", getTodosByUserId as RequestHandler);

// ✅ Get a single Todo by ID
router.get("/:id", getTodoById as RequestHandler);

// ✅ Update a Todo
router.put("/:id", updateTodo as RequestHandler);

// ✅ Delete a Todo
router.delete("/:id", deleteTodo as RequestHandler);

export default router;
