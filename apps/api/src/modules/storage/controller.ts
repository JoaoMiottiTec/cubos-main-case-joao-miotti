
import { buildKey } from './utils.js';

import { presignUpload, presignDownload, headObject } from './service.js';
import { ConfirmUploadSchema, MAX_BYTES, PresignDownloadSchema, PresignUploadSchema } from './validation.js';
import prisma from '../../prisma.js';

export class StorageController {
  async presignUpload(rawBody: unknown) {
    const parsed = PresignUploadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.flatten() } };
    }
    const { movieId, fileName, contentType, size } = parsed.data;
    if (size && size > MAX_BYTES) {
      return { status: 413, body: { error: 'File too large' } };
    }

    const key = buildKey(movieId, fileName);
    const out = await presignUpload(key, contentType);
    return { status: 200, body: out };
  }

  async presignDownload(rawBody: unknown) {
    const parsed = PresignDownloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.flatten() } };
    }
    const out = await presignDownload(parsed.data.key);
    return { status: 200, body: out };
  }

  async confirmUpload(rawParams: unknown, rawBody: unknown) {
    const { movieId } = (await import('zod')).z.object({ movieId: (await import('zod')).z.string().cuid() }).parse(rawParams);
    const body = ConfirmUploadSchema.parse(rawBody);

    const head = await headObject(body.key);

    if (body.setAsPrimary) {
      await prisma.movieImage.updateMany({
        where: { movieId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.movieImage.create({
      data: {
        movieId,
        key: body.key,
        bucket: process.env.R2_BUCKET!,
        contentType: head.contentType,
        size: head.size,
        etag: head.etag,
        type: body.type,
        isPrimary: body.setAsPrimary ?? false,
      },
      select: {
        id: true, key: true, type: true, isPrimary: true,
        contentType: true, size: true, createdAt: true,
      },
    });

    return { status: 201, body: { ok: true, image } };
  }
}
