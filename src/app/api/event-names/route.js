import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import EventName from "@/models/EventName";
import { canCreateEvents, getCurrentUser } from "@/lib/eventAuth";

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

export async function GET() {
  try {
    await connectMongo();
    const eventNames = await EventName.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, eventNames }, { status: 200 });
  } catch (error) {
    console.error("Fetch event names error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user } = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!(await canCreateEvents(user))) {
      return NextResponse.json({ success: false, message: "You are not allowed to create event names" }, { status: 403 });
    }

    const name = normalizeName((await req.json()).name);
    if (!name) return NextResponse.json({ success: false, message: "Event name is required" }, { status: 400 });

    await connectMongo();
    const eventName = await EventName.findOneAndUpdate(
      { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
      { $setOnInsert: { name } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ success: true, eventName }, { status: 201 });
  } catch (error) {
    console.error("Create event name error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: error.code === 11000 ? 409 : 500 });
  }
}
