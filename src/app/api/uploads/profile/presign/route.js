import { randomUUID } from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/eventAuth";

export const runtime = "nodejs";

const DEFAULT_MAX_SIZE_MB = 1;
const configuredMaxSizeMb = Number(process.env.NEXT_PUBLIC_PROFILE_MAX_SIZE_MB);
const maxSizeMb = Number.isFinite(configuredMaxSizeMb) && configuredMaxSizeMb > 0
  ? configuredMaxSizeMb
  : DEFAULT_MAX_SIZE_MB;
const MAX_FILE_SIZE = maxSizeMb * 1024 * 1024;
const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getR2Client() {
  const requiredVariables = [
    "R2_ENDPOINT",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
  ];

  if (requiredVariables.some((name) => !process.env[name])) {
    throw new Error("R2 storage is not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function POST(req) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const contentType = String(payload.contentType || "").toLowerCase();
    const fileSize = Number(payload.fileSize);

    if (!allowedContentTypes.has(contentType)) {
      return NextResponse.json(
        { message: "Profile picture must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: `Profile picture must be ${maxSizeMb} MB or smaller` },
        { status: 400 }
      );
    }

    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) {
      throw new Error("R2 bucket is not configured");
    }

    const extension = contentType.split("/")[1];
    const key = `profiles/${user._id}/${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    });
    const uploadUrl = await getSignedUrl(getR2Client(), command, {
      expiresIn: 600,
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl: `/api/uploads/profile/${key}`,
    });
  } catch (error) {
    console.error("Profile image presign error:", error);
    return NextResponse.json(
      { message: error.message || "Could not prepare profile picture upload" },
      { status: 500 }
    );
  }
}