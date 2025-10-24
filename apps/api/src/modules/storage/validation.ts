import { z } from 'zod';

export const ALLOWED_CT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export const MAX_BYTES = 5 * 1024 * 1024;

export const PresignUploadSchema = z.object({
  movieId: z.string().cuid(),
  fileName: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_CT),
  size: z.number().int().positive().max(MAX_BYTES).optional(),
});

export const PresignDownloadSchema = z.object({
  key: z.string().min(3),
});

export const ConfirmUploadSchema = z.object({
  key: z.string().min(3),
  type: z.enum(['POSTER', 'GALLERY']).default('GALLERY'),
  setAsPrimary: z.boolean().optional(),
});
