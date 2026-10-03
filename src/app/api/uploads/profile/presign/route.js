import { NextResponse } from "next/server";
import { presignProfileUpload } from "@/lib/r2";
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

    const { uploadUrl, publicUrl, key } = await presignProfileUpload({
      userId: String(user._id),
      contentType,
      fileSize,
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Profile image presign error:", error);
    return NextResponse.json(
      { message: error.message || "Could not prepare profile picture upload" },
      { status: 500 }
    );
  }
}
