import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/models/Category";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import {
  canCreateEvents,
  getCurrentUser,
  hydrateEventPeople,
  isEventHead,
  isEventHeadOrCoordinator,
  resolveUsersByCollegeIDs,
  resolveUsersByEmails,
} from "@/lib/eventAuth";

function normalizeCode(code) {
  return String(code || "").trim().toLowerCase();
}

async function resolveCategory(payload) {
  if (payload.categoryId) {
    const category = await Category.findById(payload.categoryId);
    if (category) return category;
  }

  const name = String(payload.category || "").trim().replace(/\s+/g, " ");
  return Category.findOneAndUpdate(
    { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    { $setOnInsert: { name } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
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

  const minParticipants = Number(payload.minParticipants);
  const maxParticipants = Number(payload.maxParticipants);
  if (!Number.isInteger(minParticipants) || minParticipants < 1) {
    return "Minimum participants must be a positive whole number";
  }
  if (!Number.isInteger(maxParticipants) || maxParticipants < minParticipants) {
    return "Maximum participants must be at least the minimum participants";
  }
  const eventType = String(payload.eventType || "").trim().toLowerCase();
  if (!["individual", "team", "performance"].includes(eventType)) {
    return "Choose a valid participation type";
  }
  if (payload.paymentRequired) {
    if (Number(payload.paymentRequired.amount) < 0 || !String(payload.paymentRequired.qrCodeUrl || "").trim()) {
      return "Payment amount and QR code URL are required when payment is enabled";
    }
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

    const [eventWithImages] = await hydrateEventPeople(event);

    return NextResponse.json({ success: true, event: eventWithImages }, { status: 200 });
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

    if (!isEventHeadOrCoordinator(event, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only event heads or coordinators can edit event details" },
        { status: 403 }
      );
    }

    const payload = await req.json();
    const validationError = validateEventPayload(payload);
    const eventType = String(payload.eventType || "").trim().toLowerCase();
    const minParticipants = Number(payload.minParticipants);
    const maxParticipants = Number(payload.maxParticipants);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const nextCode = normalizeCode(payload.code);
    const category = await resolveCategory(payload);

    if (nextCode !== event.code) {
      const duplicate = await Event.findOne({ code: nextCode });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: "Event code already exists" },
          { status: 409 }
        );
      }
    }

    const userIsHead = isEventHead(event, user.email);

    const eventHeadEmails = Array.isArray(payload.eventHeadEmails)
      ? (userIsHead ? [...new Set([...payload.eventHeadEmails, user.email])] : payload.eventHeadEmails)
      : null;
    const eventHeads = eventHeadEmails
      ? await resolveUsersByEmails(eventHeadEmails, "event heads")
      : null;

    const coordinatorEmails = Array.isArray(payload.coordinatorEmails)
      ? (!userIsHead ? [...new Set([...payload.coordinatorEmails, user.email])] : payload.coordinatorEmails)
      : null;
    const coordinators = coordinatorEmails
      ? await resolveUsersByEmails(coordinatorEmails, "coordinators", true)
      : null;

    const coCoordinators = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators", true)
      : null;

    const eventHeadIDs = Array.isArray(payload.eventHeadCollegeIDs)
      ? payload.eventHeadCollegeIDs
      : event.eventHeads.map((head) => head.collegeID);

    if (userIsHead && user.collegeID && !eventHeadIDs.includes(user.collegeID)) {
      eventHeadIDs.push(user.collegeID);
    }

    const coordinatorIDs = Array.isArray(payload.coordinatorCollegeIDs)
      ? payload.coordinatorCollegeIDs
      : event.coordinators.map((c) => c.collegeID);

    if (!userIsHead && user.collegeID && !coordinatorIDs.includes(user.collegeID)) {
      coordinatorIDs.push(user.collegeID);
    }

    event.name = payload.name;
    event.code = nextCode;
    event.category = category.name;
    event.categoryId = category._id;
    event.location = payload.location;
    event.startsAt = payload.startsAt;
    event.endsAt = payload.endsAt;
    event.description = payload.description;
    event.eventType = eventType;
    event.minParticipants = minParticipants;
    event.maxParticipants = maxParticipants;
    event.allowPerformanceTypes = Boolean(payload.allowPerformanceTypes);
    event.paymentRequired = payload.paymentRequired || undefined;
    event.rulebookLink = payload.rulebookLink;
    event.posterLink = payload.posterLink;
    event.eventHeads = eventHeads || await resolveUsersByCollegeIDs(eventHeadIDs, "event heads");
    event.coordinators = coordinators || await resolveUsersByCollegeIDs(
      coordinatorIDs,
      "coordinators"
    );
    event.coCoordinators = coCoordinators || await resolveUsersByCollegeIDs(
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

    const canDelete = isEventHeadOrCoordinator(event, user.email) || (await canCreateEvents(user));
    if (!canDelete) {
      return NextResponse.json(
        { success: false, message: "Only event heads, coordinators, or event administrators can delete this event" },
        { status: 403 }
      );
    }

    await Registration.deleteMany({ eventId: event.code });
    await event.deleteOne();

    return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
