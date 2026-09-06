import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import {
  canCreateEvents,
  getCurrentUser,
  resolveUsersByCollegeIDs,
  snapshotUser,
} from "@/lib/eventAuth";

function normalizeCode(code) {
  return String(code || "").trim().toLowerCase();
}

function validateEventPayload(payload) {
  const requiredFields = [
    "name",
    "code",
    "category",
    "location",
    "startsAt",
    "endsAt",
    "description",
    "rulebookLink",
    "posterLink",
  ];

  const missing = requiredFields.filter((field) => !String(payload[field] || "").trim());
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  const startsAt = new Date(payload.startsAt);
  const endsAt = new Date(payload.endsAt);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return "Start and end timings must be valid dates";
  }

  if (endsAt <= startsAt) {
    return "End timing must be after start timing";
  }

  return null;
}

export async function GET(req) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope");
    const query = scope === "mine" ? { "eventHeads.email": user.email } : {};

    const events = await Event.find(query).sort({ startsAt: 1 }).lean();

    return NextResponse.json(
      { success: true, events, canCreateEvents: canCreateEvents(user) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!canCreateEvents(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to create events. Ask an event admin to add your email to EVENT_CREATOR_EMAILS.",
        },
        { status: 403 }
      );
    }

    if (!user.collegeID || !user.name) {
      return NextResponse.json(
        { success: false, message: "Please complete your profile before creating events" },
        { status: 400 }
      );
    }

    const payload = await req.json();
    const validationError = validateEventPayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    await connectMongo();

    const code = normalizeCode(payload.code);
    const existing = await Event.findOne({ code });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Event code already exists" },
        { status: 409 }
      );
    }

    const currentUserCollegeID = user.collegeID;
    const eventHeadIDs = [
      currentUserCollegeID,
      ...(Array.isArray(payload.eventHeadCollegeIDs) ? payload.eventHeadCollegeIDs : []),
    ];

    const eventHeads = await resolveUsersByCollegeIDs(eventHeadIDs, "event heads");
    const coordinators = await resolveUsersByCollegeIDs(
      Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
      "coordinators"
    );
    const coCoordinators = await resolveUsersByCollegeIDs(
      Array.isArray(payload.coCoordinatorCollegeIDs) ? payload.coCoordinatorCollegeIDs : [],
      "co-coordinators"
    );

    const event = await Event.create({
      name: payload.name,
      code,
      category: payload.category,
      location: payload.location,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      description: payload.description,
      rulebookLink: payload.rulebookLink,
      posterLink: payload.posterLink,
      eventHeads: eventHeads.length > 0 ? eventHeads : [snapshotUser(user)],
      coordinators,
      coCoordinators,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}
