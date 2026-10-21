import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import EventName from "@/models/EventName";
import Category from "@/models/Category";
import Upload from "@/models/Uploads";
import { resolveUsersByEmails } from "@/lib/eventAuth";
import { parseISTDateTime } from "@/lib/ist";
import { deletePosterImage } from "@/lib/r2";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

function normalizeEmails(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(/[\n,]+/);
  return [...new Set(values.map((email) => String(email).trim().toLowerCase()).filter(Boolean))];
}

export async function PATCH(req, { params }) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const event = await Event.findOne({ code: String((await params).code).trim().toLowerCase() });
    if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    const payload = await req.json();
    const required = ["name", "code", "category", "location", "startsAt", "endsAt", "description", "rulebookLink", "posterLink"];
    const missing = required.filter((field) => !String(payload[field] || "").trim());
    if (missing.length) return NextResponse.json({ success: false, message: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    const startsAt = parseISTDateTime(payload.startsAt);
    const endsAt = parseISTDateTime(payload.endsAt);
    const minParticipants = Number(payload.minParticipants);
    const maxParticipants = Number(payload.maxParticipants);
    if (!startsAt || !endsAt || endsAt <= startsAt) return NextResponse.json({ success: false, message: "End timing must be after start timing" }, { status: 400 });
    if (!Number.isInteger(minParticipants) || !Number.isInteger(maxParticipants) || minParticipants < 1 || maxParticipants < minParticipants) return NextResponse.json({ success: false, message: "Participant limits are invalid" }, { status: 400 });
    if (!["individual", "team", "performance"].includes(payload.eventType)) return NextResponse.json({ success: false, message: "Choose a valid participation type" }, { status: 400 });
    const code = String(payload.code).trim().toLowerCase();
    if (code !== event.code && await Event.exists({ code })) return NextResponse.json({ success: false, message: "Event code already exists" }, { status: 409 });
    const eventName = await EventName.findOneAndUpdate({ name: payload.name.trim() }, { $setOnInsert: { name: payload.name.trim() } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const category = await Category.findOneAndUpdate({ name: payload.category.trim() }, { $setOnInsert: { name: payload.category.trim() } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const heads = await resolveUsersByEmails(normalizeEmails(payload.eventHeadEmails), "event heads");
    if (!heads.length) return NextResponse.json({ success: false, message: "Add at least one event head" }, { status: 400 });
    const coordinators = await resolveUsersByEmails(normalizeEmails(payload.coordinatorEmails), "coordinators");
    const coCoordinators = await resolveUsersByEmails(normalizeEmails(payload.coCoordinatorEmails), "co-coordinators");
    const oldPosterLink = event.posterLink;
    Object.assign(event, { code, eventNameId: eventName._id, categoryId: category._id, location: payload.location.trim(), startsAt, endsAt, description: payload.description.trim(), eventType: payload.eventType, minParticipants, maxParticipants, allowPerformanceTypes: Boolean(payload.allowPerformanceTypes), paymentRequired: payload.paymentRequired?.amount || payload.paymentRequired?.qrCodeUrl ? payload.paymentRequired : undefined, rulebookLink: payload.rulebookLink.trim(), posterLink: payload.posterLink.trim(), eventHeads: heads.map((user) => user._id), coordinators: coordinators.map((user) => user._id), coCoordinators: coCoordinators.map((user) => user._id) });
    await event.save();
    if (oldPosterLink !== event.posterLink) {
      await deletePosterImage(oldPosterLink);
      const uploadFilter = {
        type: "poster",
        referenceId: event._id,
        referenceType: "Event",
      };
      if (mongoose.isValidObjectId(payload.posterUploadId)) {
        uploadFilter._id = { $ne: payload.posterUploadId };
      }
      await Upload.deleteMany(uploadFilter);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin event update error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not update event" }, { status: error.status || 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const code = String((await params).code).trim().toLowerCase();
    const event = await Event.findOne({ code });
    if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });

    await deletePosterImage(event.posterLink);
    await Upload.deleteMany({ type: "poster", referenceId: event._id, referenceType: "Event" });
    await Event.deleteOne({ _id: event._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin event delete error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not delete event" }, { status: error.status || 500 });
  }
}
