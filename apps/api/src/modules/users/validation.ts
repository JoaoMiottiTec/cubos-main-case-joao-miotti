import { z } from 'zod';

export const Email = z.string().email().trim().toLowerCase();
export const Password = z.string().min(6).max(72);
export const Username = z.string().min(1).trim();

export const createUserSchema = z
  .object({
    name: z.string().min(1).trim(),
    email: Email,
    password: Password,
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    email: Email.optional(),
    password: Password.optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: Email.optional(),
    username: Username.optional(),
    password: Password,
  })
  .refine((d) => d.email || d.username, {
    message: 'Send email ou username',
    path: ['email'],
  })
  .strict();

export const IdParam = z.object({ id: z.string().min(1) }).strict();
export const ListQuery = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();
