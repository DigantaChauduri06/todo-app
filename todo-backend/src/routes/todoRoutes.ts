import express from "express";
import { createTodo, getTodos } from "../controllers/todoController";

const router = express.Router();

router.post("/create", createTodo);
router.get("/todos", getTodos);
// router.get("/get-by-id/:id", getTodoById);
// router.put("/update/:id", updateTodo);
// router.delete("/delete/:id", deleteTodo);
// // search by assignee
// router.get("/search-assignee/:username", searchByUsername);
// search by 

export default router;
