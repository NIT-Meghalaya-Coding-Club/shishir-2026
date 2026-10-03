import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import SacPost from "@/models/SacPost";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  await connectMongo();
  const posts = await SacPost.find({}).sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({ success: true, posts });
}

export async function POST(request) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const payload = await request.json();
    const post = await SacPost.create({
      name: String(payload.name || "").trim(),
      post: String(payload.post || "").trim(),
      phone: String(payload.phone || "").trim(),
      email: String(payload.email || "").trim().toLowerCase(),
      order: Number.isInteger(payload.order) ? payload.order : 0,
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Admin SAC post creation error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not create SAC post" }, { status: 400 });
  }
}
