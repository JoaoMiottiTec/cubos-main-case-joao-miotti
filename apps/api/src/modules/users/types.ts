import z from "zod";
import { createUserSchema, loginSchema, updateUserSchema } from "./validation.js";

export type UserSafe = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  token: string;
  user: UserSafe;
};


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;