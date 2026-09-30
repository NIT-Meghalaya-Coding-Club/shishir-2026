import { S3Client } from "@aws-sdk/client-s3";

const REQUIRED_CLIENT_VARS = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
] as const;

export type R2Config = {
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  publicBaseUrl: string;
};

let cachedClient: S3Client | undefined;

export function getR2Config(): R2Config {
  return {
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "") || "",
  };
}

export function getR2Client(): S3Client {
  const missing = REQUIRED_CLIENT_VARS.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error("R2 storage is not configured");
  }

  if (!cachedClient) {
    const { endpoint, accessKeyId, secretAccessKey } = getR2Config();

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error("R2 storage is not configured");
    }

    cachedClient = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return cachedClient;
}

export function requireR2Bucket(): string {
  const { bucket } = getR2Config();
  if (!bucket) {
    throw new Error("R2 bucket is not configured");
  }
  return bucket;
}

export function requireR2PublicConfig(): { bucket: string; publicBaseUrl: string } {
  const { bucket, publicBaseUrl } = getR2Config();
  if (!bucket || !publicBaseUrl) {
    throw new Error("R2 bucket or public URL is not configured");
  }
  return { bucket, publicBaseUrl };
}
