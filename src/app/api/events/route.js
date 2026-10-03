import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/models/Category";
import EventName from "@/models/EventName";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import Upload from "@/models/Uploads";
import mongoose from "mongoose";
import {
  canCreateEvents,
  getCurrentUser,
  hydrateEventPeople,
  isEventHeadOrCoordinator,
  resolveUsersByCollegeIDs,
  resolveUsersByEmails,
} from "@/lib/eventAuth";
import { getPosterPublicUrl } from "@/lib/r2";

function withEventName(event) {
  if (!event) return event;
  return {
    ...event,
    name: event.eventNameId?.name || event.name || "",
  };
}

function withCategoryName(event) {
  if (!event) return event;
  return {
    ...event,
    category: event.categoryId?.name || event.category || "",
  };
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

async function resolveEventName(payload) {
  if (payload.eventNameId) {
    const eventName = await EventName.findById(payload.eventNameId);
    if (eventName) return eventName;
  }

  const name = String(payload.name || "").trim().replace(/\s+/g, " ");
  return EventName.findOneAndUpdate(
    { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    { $setOnInsert: { name } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

async function findExistingEventMessage(eventName) {
  const existingEvent = await Event.findOne({
    $or: [
      { eventNameId: eventName._id },
      { name: { $regex: `^${eventName.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    ],
  })
    .populate("eventHeads", "name email")
    .lean();

  if (!existingEvent) return null;
  const creator = existingEvent.eventHeads?.[0];
  return creator
    ? `A user named "${creator.name}" with email "${creator.email}" has already created this event. Contact them to have your name added as an event head.`
    : "This event has already been created. Contact its existing event heads to be added.";
}

async function generateUniqueCode() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bytes = randomBytes(10);
    const code = Array.from(bytes, (byte) => characters[byte % characters.length]).join("");

    if (!(await Event.exists({ code }))) {
      return code;
    }
  }

  throw new Error("Could not generate a unique event code");
}

function validateEventPayload(payload) {
  const requiredFields = [
    "name",
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

  const requiredPeople = [
    ["eventHeadCollegeIDs", "event heads"],
  ];
  const missingPeople = requiredPeople
    .filter(([field]) => !Array.isArray(payload[field]) || payload[field].length === 0)
    .map(([, label]) => label);

  if (missingPeople.length > 0) {
    return `Add at least one user to: ${missingPeople.join(", ")}`;
  }

  return null;
}

export async function GET(req) {
  try {
    const { user } = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope");
    if (scope === "mine" && !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const query = scope === "mine"
      ? {
        $or: [
          { eventHeads: user._id },
          { coordinators: user._id },
          { coCoordinators: user._id },
        ],
      }
      : {};

    const events = await Event.find(query)
      .populate("eventNameId", "name")
      .populate("categoryId", "name")
      .populate("eventHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy")
      .sort({ startsAt: 1 })
      .lean();

    const eventsWithPeople = (await hydrateEventPeople(events)).map((event) => ({
      ...event,
      name: event.eventNameId?.name || event.name || "",
      category: event.categoryId?.name || event.category || "",
      posterLink: getPosterPublicUrl(event.posterLink),
    }));

    return NextResponse.json(
      { success: true, events: eventsWithPeople, canCreateEvents: user ? await canCreateEvents(user) : false },
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

    if (!(await canCreateEvents(user))) {
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
    const eventType = String(payload.eventType || "").trim().toLowerCase();

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    await connectMongo();

    const code = await generateUniqueCode();
    const category = await resolveCategory(payload);
    const eventName = await resolveEventName(payload);
    const duplicateMessage = await findExistingEventMessage(eventName);
    if (duplicateMessage) {
      return NextResponse.json(
        { success: false, message: duplicateMessage },
        { status: 409 }
      );
    }

    const currentUserCollegeID = user.collegeID;
    const eventHeadIDs = [
      currentUserCollegeID,
      ...(Array.isArray(payload.eventHeadCollegeIDs) ? payload.eventHeadCollegeIDs : []),
    ];

    const eventHeadUsers = await resolveUsersByCollegeIDs(eventHeadIDs, "event heads");
    const coordinatorUsers = Array.isArray(payload.coordinatorEmails)
      ? await resolveUsersByEmails(payload.coordinatorEmails, "coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
        "coordinators"
      );
    const coCoordinatorUsers = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coCoordinatorCollegeIDs) ? payload.coCoordinatorCollegeIDs : [],
        "co-coordinators"
      );

    const createdEvent = await Event.create({
      name: eventName.name,
      eventNameId: eventName._id,
      code,
      category: category.name,
      categoryId: category._id,
      location: payload.location,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      description: payload.description,
      eventType,
      minParticipants: Number(payload.minParticipants),
      maxParticipants: Number(payload.maxParticipants),
      allowPerformanceTypes: Boolean(payload.allowPerformanceTypes),
      paymentRequired: payload.paymentRequired || undefined,
      rulebookLink: payload.rulebookLink,
      posterLink: payload.posterLink,
      eventHeads: eventHeadUsers.length > 0 ? eventHeadUsers.map((u) => u._id) : [user._id],
      coordinators: coordinatorUsers.map((u) => u._id),
      coCoordinators: coCoordinatorUsers.map((u) => u._id),
    });
    await Event.collection.updateOne(
      { _id: createdEvent._id },
      { $unset: { name: "", category: "" } }
    );
    if (mongoose.isValidObjectId(payload.posterUploadId)) {
      await Upload.updateOne(
        {
          _id: payload.posterUploadId,
          type: "poster",
          referenceId: user._id,
          referenceType: "User",
        },
        {
          $set: {
            referenceId: createdEvent._id,
            referenceType: "Event",
          },
        }
      );
    }

    const event = await Event.findById(createdEvent._id)
      .populate("eventNameId", "name")
      .populate("categoryId", "name")
      .populate("eventHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy")
      .lean();

    return NextResponse.json({
      success: true,
      event: {
        ...withCategoryName(withEventName(event)),
        posterLink: getPosterPublicUrl(event.posterLink),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let code = searchParams.get("code") || searchParams.get("id");

    if (!code) {
      try {
        const body = await req.json();
        code = body?.code || body?.id || body?.eventId;
      } catch {}
    }

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Event code or ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const normalizedCode = String(code).trim().toLowerCase();
    const event = await Event.findOne({
      $or: [
        { code: normalizedCode },
        ...(mongoose.Types.ObjectId.isValid(code) ? [{ _id: code }] : []),
      ],
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const canDelete = isEventHeadOrCoordinator(event, user) || (await canCreateEvents(user));
    if (!canDelete) {
      return NextResponse.json(
        { success: false, message: "Only event heads, coordinators, or event administrators can delete this event" },
        { status: 403 }
      );
    }

    await Registration.deleteMany({ eventId: event.code });
    await event.deleteOne();

    return NextResponse.json(
      { success: true, message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
