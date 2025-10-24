// apps/api/src/modules/storage/types.ts
import { z } from 'zod';
import { ConfirmUploadSchema, PresignDownloadSchema, PresignUploadSchema } from './validation.js';


export type PresignUploadDTO = z.infer<typeof PresignUploadSchema>;
export type PresignDownloadDTO = z.infer<typeof PresignDownloadSchema>;
export type ConfirmUploadDTO = z.infer<typeof ConfirmUploadSchema>;

export type PresignOut = { url: string; key: string; expiresIn: number };
export type HeadOut = { contentType: string | null; size: number | null; etag: string | null };
