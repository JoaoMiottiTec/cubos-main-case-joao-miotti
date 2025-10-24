import argon2 from 'argon2';

import { notFound, unauthorized } from '../../core/errors.js';
import prisma from '../../prisma.js';
import { userSelect, userWithPasswordSelect } from '../users/select.js';
import type { LoginInput, UserSafe } from '../users/types.js';

export const authService = {
  async verifyCredentials(input: LoginInput): Promise<UserSafe> {
    const email = input.email?.trim().toLowerCase();
    if (!email) throw unauthorized('Invalid credentials');

    const user = await prisma.user.findUnique({
      where: { email },
      select: userWithPasswordSelect,
    });
    if (!user) throw unauthorized('Invalid credentials');

    const ok = await argon2.verify(user.password, input.password);
    if (!ok) throw unauthorized('Invalid credentials');

    const safe = await prisma.user.findUnique({
      where: { id: user.id },
      select: userSelect,
    });
    if (!safe) throw notFound('User not found');

    return safe;
  },

  async confirmEmail(token: string) {
    const now = new Date();
    const found = await prisma.user.findFirst({
      where: {
        confirmToken: token,
        confirmTokenExpires: { gt: now },
      },
      select: { id: true, confirmed: true },
    });

    if (!found) return { ok: false };

    await prisma.user.update({
      where: { id: found.id },
      data: { confirmed: true, confirmToken: null, confirmTokenExpires: null },
    });
    return { ok: true };
  },

  async findWithPasswordByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: userWithPasswordSelect,
    });
  },
};
