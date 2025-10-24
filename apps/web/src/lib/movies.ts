import { http } from './http';
import type { Movie, MovieImage } from '@/types/movie';

export async function listMovies() {
  const { movies } = await http.get<{ movies: Movie[] }>('/movies');
  return movies;
}
export async function getMovie(id: string) {
  const { movie } = await http.get<{ movie: Movie }>(`/movies/${id}`);
  return movie;
}

export async function createMovie(payload: {
  title: string;
  releaseDate: string;
  durationMinutes: number;
  genres: string[];
}) {
  const { movie } = await http.post<{ movie: Movie }>('/movies', payload, { auth: true });
  return movie;
}

export async function presignUpload(movieId: string, file: File) {
  return http.post<{ url: string; key: string; expiresIn: number }>(
    '/storage/presign-upload',
    { movieId, fileName: file.name, contentType: file.type, size: file.size },
    { auth: true },
  );
}
export async function putToR2(url: string, file: File) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error('Upload failed');
}
export async function confirmImage(movieId: string, key: string, setAsPrimary = true) {
  const { image } = await http.post<{ ok: true; image: MovieImage }>(
    `/storage/movies/${movieId}/images/confirm`,
    { key, type: 'POSTER', setAsPrimary },
    { auth: true },
  );
  return image;
}
export async function getPosterUrl(movieId: string) {
  const { url } = await http.get<{ url: string; key: string; expiresIn: number }>(
    `/movies/${movieId}/poster`,
  );
  return url;
}
