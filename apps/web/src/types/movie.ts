export type MovieStatus = 'PLANNED' | 'IN_PRODUCTION' | 'RELEASED' | 'CANCELLED';

export interface Movie {
  id: string;
  userId: string;
  title: string;
  originalTitle?: string | null;
  tagline?: string | null;
  description?: string | null;
  releaseDate: string; // ISO string
  durationMinutes: number;
  status: MovieStatus;
  originalLanguage?: string | null;
  posterUrl?: string | null;      // compat, pode vir vazio
  trailerUrl?: string | null;
  popularity?: number | null;
  voteCount?: number | null;
  voteAverage?: number | null;
  budgetUSD?: number | null;
  revenueUSD?: number | null;
  profitUSD?: number | null;
  genres: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MovieImage {
  id: string;
  movieId: string;
  key: string;
  bucket: string;
  contentType: string | null;
  size: number | null;
  etag: string | null;
  type: 'POSTER' | 'GALLERY';
  isPrimary: boolean;
  createdAt: string;
}
