import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { R2 } from '../../infra/r2.js';
import type { HeadOut, PresignOut } from './types.js';

export async function presignUpload(key: string, contentType: string): Promise<PresignOut> {
  const cmd = new PutObjectCommand({ Bucket: R2.bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(R2.s3, cmd, { expiresIn: R2.expires });
  return { url, key, expiresIn: R2.expires };
}

export async function presignDownload(key: string): Promise<PresignOut> {
  const cmd = new GetObjectCommand({ Bucket: R2.bucket, Key: key });
  const url = await getSignedUrl(R2.s3, cmd, { expiresIn: R2.expires });
  return { url, key, expiresIn: R2.expires };
}

export async function headObject(key: string): Promise<HeadOut> {
  const out = await R2.s3.send(new HeadObjectCommand({ Bucket: R2.bucket, Key: key }));
  return {
    contentType: out.ContentType ?? null,
    size: typeof out.ContentLength === 'number' ? out.ContentLength : null,
    etag: out.ETag ?? null,
  };
}

export async function deleteObject(key: string) {
  await R2.s3.send(new DeleteObjectCommand({ Bucket: R2.bucket, Key: key }));
  return { ok: true };
}
