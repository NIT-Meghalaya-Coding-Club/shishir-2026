import { NextResponse } from "next/server";
import { presignPosterUpload } from "@/lib/r2";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import { canCreateEvents, getCurrentUser, isEventHeadOrCoordinator } from "@/lib/eventAuth";

export const runtime = "nodejs";

const DEFAULT_MAX_SIZE_MB = 2;
const configuredMaxSizeMb = Number(process.env.NEXT_PUBLIC_POSTER_MAX_SIZE_MB);
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
    const eventCode = String(payload.eventCode || "").trim().toLowerCase();

    if (!allowedContentTypes.has(contentType)) {
      return NextResponse.json(
        { message: "Poster must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: `Poster must be ${maxSizeMb} MB or smaller` },
        { status: 400 }
      );
    }

    if (eventCode) {
      await connectMongo();
      const event = await Event.findOne({ code: eventCode });

      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }

      if (!isEventHeadOrCoordinator(event, user.email)) {
        return NextResponse.json(
          { message: "Only event heads or coordinators can upload this poster" },
          { status: 403 }
        );
      }
    } else if (!(await canCreateEvents(user))) {
      return NextResponse.json(
        { message: "You are not allowed to upload event posters" },
        { status: 403 }
      );
    }

    const { uploadUrl, publicUrl } = await presignPosterUpload({
      userId: String(user._id),
      contentType,
      fileSize,
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl,
    });
  } catch (error) {
    console.error("Poster presign error:", error);
    return NextResponse.json(
      { message: error.message || "Could not prepare poster upload" },
      { status: 500 }
    );
  }
}
