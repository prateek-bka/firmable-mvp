import { model, Schema, type Document } from "mongoose";
import type { User } from "../../types/userType.js";

export interface UserDocument extends Document, User {}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export const userModel = model<UserDocument>("User", userSchema);
