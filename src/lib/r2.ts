import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getR2Client,
  getR2Config,
  requireR2Bucket,
  requireR2PublicConfig,
} from "@/config/r2";

const PRESIGN_EXPIRES_IN_SECONDS = 600;
const PROFILE_PROXY_PREFIX = "/api/uploads/profile/";
const POSTER_PROXY_PREFIX = "/api/uploads/poster/";
const POSTER_PREFIX = "posters/";

export type PresignedUpload = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

export type UploadedObject = {
  publicUrl: string;
  key: string;
};

function makeObjectKey(
  folder: string,
  userId: string,
  contentType: string,
  fallbackExtension?: string
) {
  const extension = contentType.split("/")[1] || fallbackExtension;
  return `${folder}/${userId}/${randomUUID()}.${extension}`;
}

async function presignPutObject(options: {
  key: string;
  contentType: string;
  fileSize: number;
  bucket: string;
}) {
  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: options.key,
    ContentType: options.contentType,
    ContentLength: options.fileSize,
  });

  return getSignedUrl(getR2Client(), command, {
    expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
  });
}

export async function presignPosterUpload(options: {
  userId: string;
  contentType: string;
  fileSize: number;
}): Promise<PresignedUpload> {
  const { bucket } = requireR2PublicConfig();
  const key = makeObjectKey("posters", options.userId, options.contentType);
  const uploadUrl = await presignPutObject({
    key,
    contentType: options.contentType,
    fileSize: options.fileSize,
    bucket,
  });

  return {
    uploadUrl,
    publicUrl: `${POSTER_PROXY_PREFIX}${key}`,
    key,
  };
}

export async function uploadPoster(options: {
  userId: string;
  contentType: string;
  fileSize: number;
  body: Buffer;
}): Promise<UploadedObject> {
  const { bucket } = requireR2PublicConfig();
  const key = makeObjectKey("posters", options.userId, options.contentType, "png");

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: options.contentType,
      ContentLength: options.fileSize,
      Body: options.body,
    })
  );

  return {
    publicUrl: `${POSTER_PROXY_PREFIX}${key}`,
    key,
  };
}

export async function presignProfileUpload(options: {
  userId: string;
  contentType: string;
  fileSize: number;
}): Promise<PresignedUpload> {
  const bucket = requireR2Bucket();
  const key = makeObjectKey("profiles", options.userId, options.contentType);
  const uploadUrl = await presignPutObject({
    key,
    contentType: options.contentType,
    fileSize: options.fileSize,
    bucket,
  });

  return {
    uploadUrl,
    publicUrl: `${PROFILE_PROXY_PREFIX}${key}`,
    key,
  };
}

export async function getR2Object(key: string) {
  const bucket = requireR2Bucket();
  const response = await getR2Client().send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    return null;
  }

  return {
    body: response.Body,
    contentType: response.ContentType || "image/jpeg",
  };
}

export function getOwnedProfileImageKey(image: unknown, userId: string) {
  if (typeof image !== "string" || !image || !userId) return null;

  let pathname: string;
  try {
    pathname = new URL(image, "http://localhost").pathname;
  } catch {
    return null;
  }

  const markerIndex = pathname.indexOf(PROFILE_PROXY_PREFIX);
  if (markerIndex === -1) return null;

  const key = pathname.slice(markerIndex + PROFILE_PROXY_PREFIX.length);
  const ownedPrefix = `profiles/${userId}/`;

  return key.startsWith(ownedPrefix) ? key : null;
}

export async function deleteOwnedProfileImage(image: unknown, userId: string) {
  const key = getOwnedProfileImageKey(image, userId);
  const { bucket } = getR2Config();

  if (!key || !bucket) return;

  try {
    await getR2Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    console.error("Error deleting old profile image from R2:", error);
  }
}

export function getPosterImageKey(image: unknown) {
  if (typeof image !== "string" || !image) return null;

  let pathname: string;
  try {
    pathname = new URL(image, "http://localhost").pathname;
  } catch {
    return null;
  }

  const proxyIndex = pathname.indexOf(POSTER_PROXY_PREFIX);
  const key = proxyIndex >= 0
    ? pathname.slice(proxyIndex + POSTER_PROXY_PREFIX.length)
    : pathname.replace(/^\/+/, "");
  return key.startsWith(POSTER_PREFIX) ? key : null;
}

export function getPosterPublicUrl(image: unknown) {
  if (typeof image !== "string" || !image) return image;

  const key = getPosterImageKey(image);
  return key ? `${POSTER_PROXY_PREFIX}${key}` : image;
}

export async function deletePosterImage(image: unknown) {
  const key = getPosterImageKey(image);
  const { bucket } = getR2Config();

  if (!key || !bucket) return;

  try {
    await getR2Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    console.error("Error deleting event poster from R2:", error);
  }
}
