import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";
import { getCurrentUser, isEventHead } from "@/lib/eventAuth";

export async function GET(req, { params }) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();
    const event = await Event.findOne({ code: String((await params).eventCode).toLowerCase() });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (!isEventHead(event, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only event heads can view participants" },
        { status: 403 }
      );
    }

    const registrations = await Registration.find({ eventId: event.code })
      .populate("teamData", "name email phone collegeID")
      .sort({ createdAt: -1 })
      .lean();

    const leaderEmails = registrations.map((registration) => registration.userId).filter(Boolean);
    const leaders = await User.find({ email: { $in: leaderEmails } })
      .select("name email phone collegeID")
      .lean();
    const leadersByEmail = new Map(leaders.map((leader) => [leader.email, leader]));
    const registrationsWithLeaders = registrations.map((registration) => ({
      ...registration,
      leader: leadersByEmail.get(registration.userId) || registration.teamData?.[0] || null,
    }));

    return NextResponse.json({ success: true, registrations: registrationsWithLeaders });
  } catch (error) {
    console.error("Fetch event participants error:", error);
    return NextResponse.json(
      { success: false, message: "Could not load participants" },
      { status: 500 }
    );
  }
}