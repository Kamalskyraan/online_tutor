import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.IO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.IO_SECRET_ACCESS_KEY!,
  },
});
