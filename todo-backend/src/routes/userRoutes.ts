import express, { RequestHandler } from "express";
import { createUser, getUsers, getUserByUUID, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.post("/", createUser as RequestHandler);  
router.get("/", getUsers as RequestHandler);  
router.put("/:uuid", updateUser as RequestHandler);
router.delete("/:uuid", deleteUser as RequestHandler); 

export default router;
