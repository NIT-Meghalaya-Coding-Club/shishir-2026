import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/models/Category";
import Event from "@/models/Event";
import {
  canCreateEvents,
  getCurrentUser,
  hydrateEventPeople,
  resolveUsersByCollegeIDs,
  resolveUsersByEmails,
  snapshotUser,
} from "@/lib/eventAuth";

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

    const query = scope === "mine" ? { "eventHeads.email": user.email } : {};
    const projection = user && scope === "mine"
      ? undefined
      : "name code category location startsAt endsAt description rulebookLink posterLink "
        + "eventHeads.user eventHeads.collegeID eventHeads.name eventHeads.email eventHeads.phone eventHeads.image "
        + "coordinators.user coordinators.collegeID coordinators.name coordinators.email coordinators.phone coordinators.image "
        + "coCoordinators.user coCoordinators.collegeID coCoordinators.name coCoordinators.email coCoordinators.phone coCoordinators.image";

    const events = await Event.find(query, projection).sort({ startsAt: 1 }).lean();
    const eventsWithImages = await hydrateEventPeople(events);

    return NextResponse.json(
      { success: true, events: eventsWithImages, canCreateEvents: user ? await canCreateEvents(user) : false },
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

    const currentUserCollegeID = user.collegeID;
    const eventHeadIDs = [
      currentUserCollegeID,
      ...(Array.isArray(payload.eventHeadCollegeIDs) ? payload.eventHeadCollegeIDs : []),
    ];

    const eventHeads = await resolveUsersByCollegeIDs(eventHeadIDs, "event heads");
    const coordinators = Array.isArray(payload.coordinatorEmails)
      ? await resolveUsersByEmails(payload.coordinatorEmails, "coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
        "coordinators"
      );
    const coCoordinators = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coCoordinatorCollegeIDs) ? payload.coCoordinatorCollegeIDs : [],
        "co-coordinators"
      );

    const event = await Event.create({
      name: payload.name,
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
