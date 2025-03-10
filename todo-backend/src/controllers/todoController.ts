import { Request, Response } from "express";
import Todo, { ITodo } from "../models/Todo";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, tags, priority, assignedUsers } = req.body;
    const newTodo: ITodo = new Todo({ title, description, tags, priority, assignedUsers });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error creating todo" });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().populate("assignedUsers", "username email");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos" });
  }
};
