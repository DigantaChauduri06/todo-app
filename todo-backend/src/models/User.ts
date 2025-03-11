import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  uuid: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uuid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
