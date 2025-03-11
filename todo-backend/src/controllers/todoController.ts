import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import Todo, { TodoPriorityType } from "../models/Todo";
import User from "../models/User";
import mongoose from "mongoose";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, tags, priority, assignedUsers, createdBy } = req.body;

    // Validate required fields
    if (!title || !priority || !createdBy) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Title, priority, and createdBy are required" });
    }

    // Validate priority
    if (!Object.values(TodoPriorityType).includes(priority)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid priority value" });
    }

    // Validate creator
    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User who created the Todo does not exist" });
    }

    // Validate assigned users
    if (assignedUsers && assignedUsers.length > 0) {
      const users = await User.find({ _id: { $in: assignedUsers } });
      const foundUserIds = users.map((user: any) => user._id.toString());
      const missingUserIds = assignedUsers.filter((userId: any) => !foundUserIds.includes(userId));

      if (missingUserIds.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Some assigned users do not exist", missingUsers: missingUserIds });
      }
    }

    // Create new Todo
    const newTodo = new Todo({ title, description, tags, priority, assignedUsers, createdBy });
    await newTodo.save();

    // Convert document to an object and remove `_id`
    const responseTodo = newTodo.toObject();

    res.status(StatusCodes.CREATED).json({ message: "Todo created successfully", todo: responseTodo });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error creating todo" });
  }
};

export const getTodosByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let { pageNumber, pageSize, priority, assignedUsers } = req.body;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User not found" });
    }

    // Pagination Defaults
    const limit = pageSize || 10;
    const skip = pageNumber * limit; 

    // Build Filter Query
    const filter: any = { createdBy: userId };

    if (priority && priority.length > 0) {
      filter.priority = { $in: priority };
    }

    if (assignedUsers && Array.isArray(assignedUsers) && assignedUsers.length > 0) {
      // Convert assignedUsers to valid ObjectIds
      console.log("Received assignedUsers:", assignedUsers);
      const validAssignedUsers = assignedUsers
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));
        console.log("Valid assignedUsers after filtering:", validAssignedUsers);
    if (validAssignedUsers.length === 0) {
      return res.status(StatusCodes.OK).json({
        todos: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: pageNumber,
      });
    }


      if (validAssignedUsers.length > 0) {
        filter.assignedUsers = { $in: validAssignedUsers }; // ✅ Correctly filters todos assigned to any of these users
      }
    }

    console.log("Final Filter Query:", filter);

    // Fetch Paginated Todos
    const todos = await Todo.find(filter)
      .populate("assignedUsers", "username")
      .skip(skip)
      .limit(limit);

    // Count total results for frontend pagination
    const totalCount = await Todo.countDocuments(filter);

    res.status(StatusCodes.OK).json({
      todos,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching todos" });
  }
};




// ✅ Get a single Todo by UUID
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ id: id }).populate("assignedUsers", "username").populate("createdBy", "username");

    if (!todo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Todo not found" });
    }

    res.status(StatusCodes.OK).json(todo);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching todo" });
  }
};

// ✅ Update a Todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags, priority, assignedUsers } = req.body;

    if (priority && !Object.values(TodoPriorityType).includes(priority)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid priority value" });
    }

    if (assignedUsers) {
      const users = await User.find({ _id: { $in: assignedUsers } });
      if (users.length !== assignedUsers.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Some assigned users do not exist" });
      }
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { id: id },
      { title, description, tags, priority, assignedUsers },
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
    const deletedTodo = await Todo.findOneAndDelete({ id: id });

    if (!deletedTodo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Todo not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error deleting todo" });
  }
};
