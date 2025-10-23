export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

export function notFound(msg = 'Not found') {
  return new AppError(msg, 404);
}

export function conflict(msg = 'Conflict') {
  return new AppError(msg, 409);
}

export function unauthorized(msg = 'Unauthorized') {
  return new AppError(msg, 401);
}
