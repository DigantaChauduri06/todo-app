import express, { RequestHandler } from "express";
import { createUser, getUsers, getUserByUUID, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.post("/", createUser as RequestHandler);  // Create a user
router.get("/", getUsers as RequestHandler);  // Get all users
router.put("/:uuid", updateUser as RequestHandler);  // Update user by UUID
router.delete("/:uuid", deleteUser as RequestHandler);  // Delete user by UUID

export default router;
