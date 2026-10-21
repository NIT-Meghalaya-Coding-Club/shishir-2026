import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import EventName from "@/models/EventName";
import Category from "@/models/Category";
import Upload from "@/models/Uploads";
import { resolveUsersByEmails } from "@/lib/eventAuth";
import { parseISTDateTime } from "@/lib/ist";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

function normalizeEmails(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(/[\n,]+/);
  return [...new Set(values.map((email) => String(email).trim().toLowerCase()).filter(Boolean))];
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

export async function POST(req) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const payload = await req.json();
    const required = ["name", "category", "location", "startsAt", "endsAt", "description", "rulebookLink", "posterLink"];
    const missing = required.filter((field) => !String(payload[field] || "").trim());
    if (missing.length) return NextResponse.json({ success: false, message: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });

    const startsAt = parseISTDateTime(payload.startsAt);
    const endsAt = parseISTDateTime(payload.endsAt);
    const minParticipants = Number(payload.minParticipants);
    const maxParticipants = Number(payload.maxParticipants);
    if (!startsAt || !endsAt || endsAt <= startsAt) return NextResponse.json({ success: false, message: "End timing must be after start timing" }, { status: 400 });
    if (!Number.isInteger(minParticipants) || !Number.isInteger(maxParticipants) || minParticipants < 1 || maxParticipants < minParticipants) return NextResponse.json({ success: false, message: "Participant limits are invalid" }, { status: 400 });
    if (!["individual", "team", "performance"].includes(payload.eventType)) return NextResponse.json({ success: false, message: "Choose a valid participation type" }, { status: 400 });

    let code = String(payload.code || "").trim().toLowerCase();
    if (!code) {
      code = await generateUniqueCode();
    }
    if (await Event.exists({ code })) return NextResponse.json({ success: false, message: "Event code already exists" }, { status: 409 });

    const eventName = await resolveEventName(payload);
    const duplicateMessage = await findExistingEventMessage(eventName);
    if (duplicateMessage) return NextResponse.json({ success: false, message: duplicateMessage }, { status: 409 });

    const category = await Category.findOneAndUpdate({ name: payload.category.trim() }, { $setOnInsert: { name: payload.category.trim() } }, { new: true, upsert: true, setDefaultsOnInsert: true });

    const heads = await resolveUsersByEmails(normalizeEmails(payload.eventHeadEmails), "event heads");
    const coordinators = await resolveUsersByEmails(normalizeEmails(payload.coordinatorEmails), "coordinators");
    const coCoordinators = await resolveUsersByEmails(normalizeEmails(payload.coCoordinatorEmails), "co-coordinators");

    const event = await Event.create({
      name: payload.name.trim(),
      eventNameId: eventName._id,
      code,
      category: payload.category.trim(),
      categoryId: category._id,
      location: payload.location.trim(),
      startsAt,
      endsAt,
      description: payload.description.trim(),
      eventType: payload.eventType,
      minParticipants,
      maxParticipants,
      allowPerformanceTypes: Boolean(payload.allowPerformanceTypes),
      paymentRequired: payload.paymentRequired?.amount || payload.paymentRequired?.qrCodeUrl ? payload.paymentRequired : undefined,
      rulebookLink: payload.rulebookLink.trim(),
      posterLink: payload.posterLink.trim(),
      eventHeads: heads.map((u) => u._id),
      coordinators: coordinators.map((u) => u._id),
      coCoordinators: coCoordinators.map((u) => u._id),
    });

    if (mongoose.isValidObjectId(payload.posterUploadId)) {
      await Upload.updateOne(
        { _id: payload.posterUploadId, type: "poster" },
        { $set: { referenceId: event._id, referenceType: "Event" } }
      );
    } else if (event.posterLink) {
      await Upload.create({ type: "poster", referenceId: event._id, referenceType: "Event", originalSize: 0, userId: null });
    }

    const saved = await Event.findById(event._id)
      .populate("eventNameId", "name")
      .populate("categoryId", "name")
      .populate("eventHeads", "name email collegeID")
      .populate("coordinators", "name email collegeID")
      .populate("coCoordinators", "name email collegeID")
      .lean();

    return NextResponse.json({ success: true, event: saved }, { status: 201 });
  } catch (error) {
    console.error("Admin create event error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not create event" }, { status: error.status || 500 });
  }
}
