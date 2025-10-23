import { Prisma } from "@prisma/client";
import { UserSafe } from "./types.js";

export const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof UserSafe, true>;


export const userWithPasswordSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
} as const);