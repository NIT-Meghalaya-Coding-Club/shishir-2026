import { NextResponse } from "next/server";
import { uploadPoster } from "@/lib/r2";
import Event from "@/models/Event";
import Upload from "@/models/Uploads";
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
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const eventCode = String(formData.get("eventCode") || "").trim().toLowerCase();

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const contentType = String(file.type || "").toLowerCase();
    const fileSize = file.size;

    if (!allowedContentTypes.has(contentType)) {
      return NextResponse.json(
        { success: false, message: "Poster must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: `Poster must be ${maxSizeMb} MB or smaller` },
        { status: 400 }
      );
    }

    let event = null;
    if (eventCode) {
      event = await Event.findOne({ code: eventCode });

      if (!event) {
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }

      if (!isEventHeadOrCoordinator(event, user)) {
        return NextResponse.json(
          { success: false, message: "Only event heads or coordinators can upload this poster" },
          { status: 403 }
        );
      }
    } else if (!(await canCreateEvents(user))) {
      return NextResponse.json(
        { success: false, message: "You are not allowed to upload event posters" },
        { status: 403 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const { publicUrl } = await uploadPoster({
      userId: String(user._id),
      contentType,
      fileSize,
      body: Buffer.from(arrayBuffer),
    });

    const upload = await Upload.create({
      type: "poster",
      referenceId: event?._id || user._id,
      referenceType: event ? "Event" : "User",
      originalSize: fileSize,
      processedSize: 0,
      userId: user._id,
    });

    return NextResponse.json({
      success: true,
      publicUrl,
      uploadId: upload._id,
    });
  } catch (error) {
    console.error("Poster upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Could not upload poster" },
      { status: 500 }
    );
  }
}
