import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import "@/models/EventName";
import "@/models/Category";
import "@/models/User";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  await connectMongo();
  const events = await Event.find()
    .populate("eventNameId", "name")
    .populate("categoryId", "name")
    .populate("eventHeads", "name email collegeID")
    .populate("coordinators", "name email collegeID")
    .populate("coCoordinators", "name email collegeID")
    .sort({ startsAt: 1 })
    .lean();
  return NextResponse.json({ success: true, events });
}
