import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  await connectMongo();
  const committees = await Committee.find()
    .populate("committeeNameId", "name")
    .populate("committeeHeads", "name email collegeID")
    .populate("coordinators", "name email collegeID")
    .populate("coCoordinators", "name email collegeID")
    .sort({ "committeeNameId.name": 1 })
    .lean();
  return NextResponse.json({ success: true, committees });
}
