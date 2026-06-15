import { Schema, model, Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Stores the salted bcrypt hash, never a plain password.
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
