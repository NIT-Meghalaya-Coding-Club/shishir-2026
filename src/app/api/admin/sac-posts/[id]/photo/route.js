import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import SacPost from "@/models/SacPost";
import Upload from "@/models/Uploads";
import { deleteTeamImage, uploadTeamPhoto } from "@/lib/r2";

export const runtime = "nodejs";
const maxSize = 2 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request, { params }) {
  if (!(await isAdminRequest())) return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  try {
    await connectMongo();
    const post = await SacPost.findById((await params).id);
    if (!post) return NextResponse.json({ success: false, message: "SAC post not found" }, { status: 404 });
    const file = (await request.formData()).get("file");
    if (!file || typeof file === "string") return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
    if (!allowedTypes.has(file.type) || !Number.isInteger(file.size) || file.size <= 0 || file.size > maxSize) {
      return NextResponse.json({ success: false, message: "Photo must be a JPEG, PNG, or WebP image up to 2 MB" }, { status: 400 });
    }
    const previousImage = post.image;
    const uploaded = await uploadTeamPhoto({ userId: "admin", contentType: file.type, fileSize: file.size, body: Buffer.from(await file.arrayBuffer()) });
    post.image = uploaded.publicUrl;
    await post.save();
    const newUpload = await Upload.create({ type: "team-photo", referenceId: post._id, referenceType: "SacPost", originalSize: file.size, userId: null });
    if (previousImage) await deleteTeamImage(previousImage);
    await Upload.deleteMany({ referenceId: post._id, referenceType: "SacPost", _id: { $ne: newUpload._id } });
    return NextResponse.json({ success: true, publicUrl: uploaded.publicUrl });
  } catch (error) {
    console.error("Admin SAC photo upload error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not upload SAC photo" }, { status: 500 });
  }
}
