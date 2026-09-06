import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import {
  getCurrentUser,
  isEventHead,
  resolveUsersByCollegeIDs,
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

export async function GET(req, { params }) {
  try {
    const { code } = await params;

    await connectMongo();

    const event = await Event.findOne({ code: normalizeCode(code) }).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("Fetch event error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { code } = await params;
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const event = await Event.findOne({ code: normalizeCode(code) });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (!isEventHead(event, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only event heads can edit event details" },
        { status: 403 }
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

    const nextCode = normalizeCode(payload.code);

    if (nextCode !== event.code) {
      const duplicate = await Event.findOne({ code: nextCode });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: "Event code already exists" },
          { status: 409 }
        );
      }
    }

    const eventHeadIDs = Array.isArray(payload.eventHeadCollegeIDs)
      ? payload.eventHeadCollegeIDs
      : event.eventHeads.map((head) => head.collegeID);

    if (!eventHeadIDs.includes(user.collegeID)) {
      eventHeadIDs.push(user.collegeID);
    }

    event.name = payload.name;
    event.code = nextCode;
    event.category = payload.category;
    event.location = payload.location;
    event.startsAt = payload.startsAt;
    event.endsAt = payload.endsAt;
    event.description = payload.description;
    event.rulebookLink = payload.rulebookLink;
    event.posterLink = payload.posterLink;
    event.eventHeads = await resolveUsersByCollegeIDs(eventHeadIDs, "event heads");
    event.coordinators = await resolveUsersByCollegeIDs(
      Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
      "coordinators"
    );
    event.coCoordinators = await resolveUsersByCollegeIDs(
      Array.isArray(payload.coCoordinatorCollegeIDs) ? payload.coCoordinatorCollegeIDs : [],
      "co-coordinators"
    );

    await event.save();

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { code } = await params;
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const event = await Event.findOne({ code: normalizeCode(code) });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (!isEventHead(event, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only event heads can delete event details" },
        { status: 403 }
      );
    }

    await event.deleteOne();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
