import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Todo, { TodoPriorityType, TodoStatus } from "../models/Todo";
import User from "../models/User";
import mongoose from "mongoose";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, tags, priority, assignedUsers, createdBy, status } = req.body;

    if (!title || !priority || !createdBy) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Title, priority, and createdBy are required" });
    }

    if (!Object.values(TodoPriorityType).includes(priority)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid priority value" });
    }

    if (status && !Object.values(TodoStatus).includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid status value" });
    }

    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User who created the Todo does not exist" });
    }

    const newTodo = new Todo({
      title,
      description,
      tags,
      priority,
      assignedUsers,
      createdBy,
      status: status || TodoStatus.PENDING,
    });

    await newTodo.save();

    res.status(StatusCodes.CREATED).json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error creating todo" });
  }
};


export const getTodosByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let { pageNumber, pageSize, priority, assignedUsers, status } = req.body;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User not found" });
    }

    const limit = pageSize || 10;
    const skip = pageNumber * limit; 

    const filter: any = { createdBy: userId };

    if (priority && priority.length > 0) {
      filter.priority = { $in: priority };
    }

    if (status && Object.values(TodoStatus).includes(status)) {
      filter.status = status;
    }

    if (assignedUsers && Array.isArray(assignedUsers) && assignedUsers.length > 0) {
      const validAssignedUsers = assignedUsers
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));

      if (validAssignedUsers.length === 0) {
        return res.status(StatusCodes.OK).json({ todos: [], totalCount: 0, totalPages: 0, currentPage: pageNumber, pendingCount: 0, completedCount: 0 });
      }

      filter.assignedUsers = { $in: validAssignedUsers };
    }

    console.log("Final Filter Query:", filter);

    // Fetch paginated todos
    const todos = await Todo.find(filter)
      .populate("assignedUsers", "username")
      .skip(skip)
      .limit(limit);

    // Count total, pending, and completed todos
    const totalCount = await Todo.countDocuments(filter);
    const pendingCount = await Todo.countDocuments({ ...filter, status: "pending" });
    const completedCount = await Todo.countDocuments({ ...filter, status: "completed" });

    res.status(StatusCodes.OK).json({
      todos,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: pageNumber,
      pendingCount,
      completedCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching todos" });
  }
};





export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ id: id }).populate("assignedUsers", "username").populate("createdBy", "username")
    .sort({ createdAt: -1 }); // Sort in descending order (newest first);

    if (!todo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Todo not found" });
    }

    res.status(StatusCodes.OK).json(todo);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags, priority, assignedUsers, status } = req.body;

    if (priority && !Object.values(TodoPriorityType).includes(priority)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid priority value" });
    }

    if (status && !["pending", "completed"].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid status value" });
    }

    if (assignedUsers) {
      const users = await User.find({ _id: { $in: assignedUsers } });
      if (users.length !== assignedUsers.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Some assigned users do not exist" });
      }
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id },
      { title, description, tags, priority, assignedUsers, status }, 
      { new: true }
    ).populate("assignedUsers", "username");

    if (!updatedTodo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Todo not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Todo updated successfully", todo: updatedTodo });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating todo" });
  }
};


export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({ _id: id });

    if (!deletedTodo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Todo not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error deleting todo" });
  }
};
