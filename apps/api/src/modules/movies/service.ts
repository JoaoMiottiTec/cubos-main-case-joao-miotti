import prisma from '../../prisma.js';
import { notFound } from '../../core/errors.js';
import { movieSelect } from './select.js';
import type { CreateMovieInput, ListMoviesQuery, MovieSafe } from './types.js';

export const moviesService = {
  async create(userId: string, input: CreateMovieInput): Promise<MovieSafe> {
    return prisma.movie.create({
      data: { ...input, userId },
      select: movieSelect,
    });
  },

  async listByUser(userId: string, q: ListMoviesQuery) {
    const where = {
      userId,
      ...(q.status ? { status: q.status } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy: { releaseDate: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        select: movieSelect,
      }),
      prisma.movie.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  },

  async findByIdOwned(userId: string, id: string): Promise<MovieSafe> {
    const movie = await prisma.movie.findFirst({ where: { id, userId }, select: movieSelect });
    if (!movie) throw notFound('Movie not found');
    return movie;
  },

  async remove(userId: string, id: string) {
    const found = await prisma.movie.findFirst({ where: { id, userId }, select: { id: true } });
    if (!found) throw notFound('Movie not found');
    await prisma.movie.delete({ where: { id } });
    return { deleted: true };
  },
};
