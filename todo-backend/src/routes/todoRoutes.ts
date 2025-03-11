import express, { RequestHandler } from "express";
import {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
} from "../controllers/todoController";

const router = express.Router();

router.post("/", createTodo as RequestHandler);

router.post("/user/:userId", getTodosByUserId as RequestHandler);

router.get("/:id", getTodoById as RequestHandler);

router.put("/:id", updateTodo as RequestHandler);

router.delete("/:id", deleteTodo as RequestHandler);

export default router;
