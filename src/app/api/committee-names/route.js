import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import CommitteeName from "@/models/CommitteeName";
import { canCreateCommittees, getCurrentUser } from "@/lib/eventAuth";

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

export async function GET() {
  try {
    await connectMongo();
    const committeeNames = await CommitteeName.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, committeeNames }, { status: 200 });
  } catch (error) {
    console.error("Fetch committee names error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user } = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!(await canCreateCommittees(user))) {
      return NextResponse.json({ success: false, message: "You are not allowed to create committee names" }, { status: 403 });
    }

    const name = normalizeName((await req.json()).name);
    if (!name) return NextResponse.json({ success: false, message: "Committee name is required" }, { status: 400 });

    await connectMongo();
    const committeeName = await CommitteeName.findOneAndUpdate(
      { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
      { $setOnInsert: { name } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ success: true, committeeName }, { status: 201 });
  } catch (error) {
    console.error("Create committee name error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: error.code === 11000 ? 409 : 500 });
  }
}
