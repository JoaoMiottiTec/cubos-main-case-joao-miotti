import { z } from 'zod';

export const Email = z.string().email().trim().toLowerCase();
export const Password = z.string().min(6).max(72);
export const Username = z.string().min(1).trim();

export const createUserSchema = z.object({
  name: z.string().min(1).trim(),
  email: Email,
  password: Password,
}).strict();

export const updateUserSchema = z.object({
  name: z.string().min(1).trim().optional(),
  email: Email.optional(),
  password: Password.optional(),
}).strict();

export const loginSchema = z.object({
  email: Email.optional(),
  username: Username.optional(),
  password: Password,
})
.refine((d) => d.email || d.username, {
  message: 'Send email ou username',
  path: ['email'],
})
.strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
