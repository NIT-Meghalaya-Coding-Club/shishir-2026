import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import Upload from "@/models/Uploads";
import { uploadPoster } from "@/lib/r2";

export const runtime = "nodejs";
const maxSize = 2 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  }
  try {
    await connectMongo();
    const event = await Event.findOne({ code: String((await params).code).trim().toLowerCase() });
    if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    const file = (await req.formData()).get("file");
    if (!file || typeof file === "string") return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
    if (!allowedTypes.has(file.type) || !Number.isInteger(file.size) || file.size <= 0 || file.size > maxSize) {
      return NextResponse.json({ success: false, message: "Poster must be a JPEG, PNG, or WebP image up to 2 MB" }, { status: 400 });
    }
    const uploaded = await uploadPoster({ userId: "admin", contentType: file.type, fileSize: file.size, body: Buffer.from(await file.arrayBuffer()) });
    await Upload.create({ type: "poster", referenceId: event._id, referenceType: "Event", originalSize: file.size, userId: null });
    return NextResponse.json({ success: true, publicUrl: uploaded.publicUrl });
  } catch (error) {
    console.error("Admin poster upload error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not upload poster" }, { status: 500 });
  }
}
