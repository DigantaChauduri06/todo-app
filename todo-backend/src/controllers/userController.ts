import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Username is required" });
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(username)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Username must contain only alphabets and numbers" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already exists" });
    }

    const newUser = new User({ uuid: uuidv4(), username });
    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user: {
        uuid: newUser.uuid,
        username: newUser.username,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error creating user" });
  }
};


// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching users" });
  }
};

// Get user by UUID
export const getUserByUUID = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching user" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response)  => {
  try {
    const { uuid } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "New username is required" });
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(newUsername)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "New username must contain only alphabets and numbers" });
    }

    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    const usernameTaken = await User.findOne({ username: newUsername });
    if (usernameTaken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "New username is already taken" });
    }

    user.username = newUsername;
    await user.save();

    res.status(StatusCodes.OK).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error updating user" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const user = await User.findOneAndDelete({ uuid });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error deleting user" });
  }
};
