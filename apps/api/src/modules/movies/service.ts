import { notFound, forbidden } from '../../core/errors.js';
import prisma from '../../prisma.js';
import { movieSelect } from './select.js';
import type { CreateMovieInput, ListMoviesQuery, MovieSafe } from './types.js';

export const moviesService = {
  async create(userId: string, input: CreateMovieInput): Promise<MovieSafe> {
    return prisma.movie.create({
      data: { ...input, userId },
      select: movieSelect,
    });
  },

  async listAll(q: ListMoviesQuery) {
    const where: any = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.search
        ? {
            OR: [
              { title: { contains: q.search, mode: 'insensitive' } },
              { genres: { hasSome: q.search.split(/\s*,\s*/).filter(Boolean) } },
            ],
          }
        : {}),
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

  async findById(id: string): Promise<MovieSafe> {
    const movie = await prisma.movie.findUnique({ where: { id }, select: movieSelect });
    if (!movie) throw notFound('Movie not found');
    return movie;
  },

  // ✅ apenas o dono pode editar
  async update(userId: string, id: string, data: Partial<CreateMovieInput>): Promise<MovieSafe> {
    const found = await prisma.movie.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!found) throw notFound('Movie not found');
    if (found.userId !== userId) throw forbidden('Você não tem permissão para editar este filme.');

    return prisma.movie.update({
      where: { id },
      data,
      select: movieSelect,
    });
  },

  // ✅ apenas o dono pode excluir
  async remove(userId: string, id: string) {
    const found = await prisma.movie.findUnique({ where: { id }, select: { id: true, userId: true } });
    if (!found) throw notFound('Movie not found');
    if (found.userId !== userId) throw forbidden('Você não tem permissão para excluir este filme.');

    await prisma.movie.delete({ where: { id } });
    return { deleted: true };
  },
};
