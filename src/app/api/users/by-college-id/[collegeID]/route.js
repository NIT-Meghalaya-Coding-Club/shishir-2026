import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { collegeID } = await params;

    if (!collegeID) {
      return NextResponse.json(
        { success: false, message: "College ID or email is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const searchTerm = decodeURIComponent(collegeID).trim();
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await User.find({
      $or: [
        { collegeID: searchTerm },
        { email: { $regex: escapedSearchTerm, $options: "i" } },
      ],
    })
      .select("name email phone collegeID dept yearOfStudy image")
      .limit(5)
      .lean();

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: users[0], users }, { status: 200 });
  } catch (error) {
    console.error("College ID lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
