import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import SacPost from "@/models/SacPost";
import Upload from "@/models/Uploads";
import { deleteTeamImage } from "@/lib/r2";

export async function PATCH(request, { params }) {
  if (!(await isAdminRequest())) return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  try {
    await connectMongo();
    const payload = await request.json();
    const post = await SacPost.findByIdAndUpdate((await params).id, {
      $set: {
        name: String(payload.name || "").trim(),
        post: String(payload.post || "").trim(),
        phone: String(payload.phone || "").trim(),
        email: String(payload.email || "").trim().toLowerCase(),
      },
    }, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ success: false, message: "SAC post not found" }, { status: 404 });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Admin SAC post update error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not update SAC post" }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  if (!(await isAdminRequest())) return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  try {
    await connectMongo();
    const post = await SacPost.findByIdAndDelete((await params).id);
    if (!post) return NextResponse.json({ success: false, message: "SAC post not found" }, { status: 404 });
    const uploads = await Upload.find({ referenceId: post._id, referenceType: "SacPost" });
    await Promise.all(uploads.map((upload) => deleteTeamImage(post.image)));
    await Upload.deleteMany({ referenceId: post._id, referenceType: "SacPost" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin SAC post deletion error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not delete SAC post" }, { status: 500 });
  }
}
