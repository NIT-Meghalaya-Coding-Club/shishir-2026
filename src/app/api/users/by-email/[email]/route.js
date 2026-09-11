import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/eventAuth";

export async function GET(req, { params }) {
  try {
    const { session } = await getCurrentUser();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { email } = await params;
    const normalizedEmail = decodeURIComponent(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectMongo();
    const user = await User.findOne({ email: normalizedEmail })
      .select("name email phone collegeID dept yearOfStudy image")
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "No registered user found for this email" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Email lookup error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}