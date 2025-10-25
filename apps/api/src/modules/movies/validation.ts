import { z } from 'zod';

const StatusEnum = z.enum(['PLANNED', 'IN_PRODUCTION', 'RELEASED', 'CANCELLED']);

export const createMovieSchema = z
  .object({
    title: z.string().min(1).trim(),
    originalTitle: z.string().min(1).trim().optional(),
    tagline: z.string().trim().optional(),
    description: z.string().trim().optional(),
    releaseDate: z.coerce.date(),
    durationMinutes: z.coerce.number().int().positive(),
    status: StatusEnum.optional(),
    originalLanguage: z.string().trim().optional(),
    posterUrl: z.string().url().optional(),
    trailerUrl: z.string().url().optional(),
    popularity: z.coerce.number().optional(),
    voteCount: z.coerce.number().int().optional(),
    voteAverage: z.coerce.number().optional(),
    budgetUSD: z.coerce.number().int().optional(),
    revenueUSD: z.coerce.number().int().optional(),
    profitUSD: z.coerce.number().int().optional(),
    genres: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const listMoviesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(12),
    status: StatusEnum.optional(),
    search: z.string().trim().min(1).max(200).optional(),
  })
  .strict();
