import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import MunPost from "@/models/MunPost";

export async function GET() {
  try {
    await connectMongo();
    const posts = await MunPost.find()
      .populate("users", "name email phone image")
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Load public MUN team error:", error);
    return NextResponse.json({ success: false, message: "Could not load the MUN team" }, { status: 500 });
  }
}
