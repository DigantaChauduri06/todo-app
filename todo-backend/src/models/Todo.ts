import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  tags: string[];
  priority: "High" | "Medium" | "Low";
  assignedUsers: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  assignedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
