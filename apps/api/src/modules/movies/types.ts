import type { z } from 'zod';

import { createMovieSchema, listMoviesQuerySchema } from './validation.js';

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type ListMoviesQuery = z.infer<typeof listMoviesQuerySchema>;

export type MovieSafe = {
  id: string;
  userId: string;
  title: string;
  originalTitle?: string | null;
  tagline?: string | null;
  description?: string | null;
  releaseDate: Date;
  durationMinutes: number;
  status: 'PLANNED' | 'IN_PRODUCTION' | 'RELEASED' | 'CANCELLED';
  originalLanguage?: string | null;
  posterUrl?: string | null;
  trailerUrl?: string | null;
  popularity?: number | null;
  voteCount?: number | null;
  voteAverage?: number | null;
  budgetUSD?: number | null;
  revenueUSD?: number | null;
  profitUSD?: number | null;
  genres: string[];
  createdAt: Date;
  updatedAt: Date;
};
