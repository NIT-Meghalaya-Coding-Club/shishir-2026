import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/eventAuth";

export async function GET(req) {
  try {
    const { session } = await getCurrentUser();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const query = new URL(req.url).searchParams.get("query")?.trim() || "";
    if (!query) {
      return NextResponse.json({ success: true, users: [] });
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await connectMongo();
    const users = await User.find({
      email: {
        $not: {
          $regex: `^${session.user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      },
      $or: [
        { email: { $regex: escapedQuery, $options: "i" } },
        { name: { $regex: escapedQuery, $options: "i" } },
      ],
    })
      .select("name email phone collegeID dept yearOfStudy image")
      .sort({ name: 1, email: 1 })
      .limit(5)
      .lean();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}