import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Enum for priority
export enum TodoPriorityType {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// ITodo interface
export interface ITodo extends Document {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  priority: TodoPriorityType;
  assignedUsers: mongoose.Schema.Types.ObjectId[];
  createdBy: mongoose.Schema.Types.ObjectId; // The user who created the todo
  createdAt: Date;
}

// Todo Schema
const TodoSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: Object.values(TodoPriorityType), required: true },
  assignedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Ensure todos are linked to a user
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
