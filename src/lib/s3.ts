import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// S3-compatible storage client
// Supports MinIO, Cloudflare R2, AWS S3 — configured entirely via env vars.
// ---------------------------------------------------------------------------

export function isS3Configured(): boolean {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY
  );
}

function getS3Client(): S3Client {
  const { S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION } = process.env;
  if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
    throw new Error(
      "S3 is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY."
    );
  }
  return new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true, // required for MinIO and most self-hosted S3
  });
}

/**
 * Upload a file buffer to S3-compatible storage.
 * Returns the public URL of the uploaded object.
 */
export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET env var is not set.");

  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Construct public URL — works for path-style endpoints (MinIO, R2, etc.)
  const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, "");
  return `${endpoint}/${bucket}/${key}`;
}
