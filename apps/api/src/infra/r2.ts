import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: process.env.R2_REGION,
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2 = {
  s3,
  bucket: process.env.R2_BUCKET!,
  expires: Number(process.env.R2_PRESIGN_EXPIRES),
};
