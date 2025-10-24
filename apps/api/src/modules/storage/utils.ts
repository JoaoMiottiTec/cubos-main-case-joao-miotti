export function sanitizeFileName(raw: string) {
  const justName = raw.split('/').pop()!.split('\\').pop()!;
  return justName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

export function buildKey(movieId: string, fileName: string) {
  const clean = sanitizeFileName(fileName);
  return `movies/${movieId}/${Date.now()}-${clean}`;
}
