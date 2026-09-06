import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { collegeID } = await params;

    if (!collegeID) {
      return NextResponse.json(
        { success: false, message: "College ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findOne({ collegeID: decodeURIComponent(collegeID).trim() })
      .select("name email phone collegeID dept yearOfStudy image")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("College ID lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
