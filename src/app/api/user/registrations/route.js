import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/eventAuth";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";

export async function GET() {
  try {
    const { session } = await getCurrentUser();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findOne({ email }).select("_id").lean();
    const registrationOwnerQuery = [{ userId: email }];

    if (user?._id) {
      registrationOwnerQuery.push({ teamData: user._id });
    }

    const registrations = await Registration.find({ $or: registrationOwnerQuery })
      .sort({ createdAt: -1 })
      .lean();
    const eventCodes = [...new Set(registrations.map((registration) => registration.eventId))];
    const events = await Event.find({ code: { $in: eventCodes } })
      .select("name code category location startsAt endsAt eventType")
      .lean();
    const eventsByCode = new Map(events.map((event) => [event.code, event]));

    const myEvents = registrations
      .map((registration) => {
        const event = eventsByCode.get(registration.eventId);
        if (!event) return null;

        const eventType = registration.metadata?.eventType || event.eventType;
        return {
          id: String(registration._id),
          eventId: event.code,
          name: event.name,
          category: event.category,
          location: event.location,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          eventType,
          role: eventType === "individual"
            ? "Participant"
            : registration.userId === email
              ? "Group Leader"
              : "Team Member",
          groupName: registration.metadata?.groupName || null,
          participantCount: registration.teamData?.length || 0,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { success: true, events: myEvents },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Fetch user registrations error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
