export type MovieStatus = 'PLANNED' | 'IN_PRODUCTION' | 'RELEASED' | 'CANCELLED';

export interface Movie {
  id: string;
  userId: string;
  title: string;
  releaseDate: string;       // ISO
  durationMinutes: number;
  genres: string[];
  status: MovieStatus;
  posterUrl?: string | null;
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
