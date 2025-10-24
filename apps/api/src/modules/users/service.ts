// src/users/service.ts
import { Prisma } from '@prisma/client';
import argon2 from 'argon2';

import { conflict, notFound } from '../../core/errors.js';
import prisma from '../../prisma.js';
import { userSelect } from './select.js';
import type { CreateUserInput, UpdateUserInput, UserSafe } from './types.js';

export const usersService = {
  async create(input: CreateUserInput): Promise<UserSafe> {
    const email = input.email.trim().toLowerCase();
    const passwordHash = await argon2.hash(input.password);

    try {
      return await prisma.user.create({
        data: { name: input.name.trim(), email, password: passwordHash },
        select: userSelect,
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw conflict('Email already registered');
      }
      throw e;
    }
  },

  async findById(id: string): Promise<UserSafe> {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw notFound('User not found');
    return user;
  },

  async list(
    page = 1,
    pageSize = 20,
  ): Promise<{
    items: UserSafe[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: userSelect,
      }),
      prisma.user.count(),
    ]);
    return { items, total, page, pageSize };
  },

  async update(id: string, input: UpdateUserInput): Promise<UserSafe> {
    const exists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw notFound('User not found');

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          name: input.name?.trim(),
          email: input.email?.trim().toLowerCase(),
        },
        select: userSelect,
      });
      return updated;
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw conflict('Email already registered');
      }
      throw e;
    }
  },

  async remove(id: string): Promise<{ deleted: true }> {
    const exists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw notFound('User not found');

    await prisma.user.delete({ where: { id } });
    return { deleted: true };
  },
};
