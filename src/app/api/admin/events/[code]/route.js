import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import EventName from "@/models/EventName";
import Category from "@/models/Category";
import { resolveUsersByEmails } from "@/lib/eventAuth";
import { deletePosterImage } from "@/lib/r2";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
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
    const startsAt = new Date(payload.startsAt);
    const endsAt = new Date(payload.endsAt);
    const minParticipants = Number(payload.minParticipants);
    const maxParticipants = Number(payload.maxParticipants);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) return NextResponse.json({ success: false, message: "End timing must be after start timing" }, { status: 400 });
    if (!Number.isInteger(minParticipants) || !Number.isInteger(maxParticipants) || minParticipants < 1 || maxParticipants < minParticipants) return NextResponse.json({ success: false, message: "Participant limits are invalid" }, { status: 400 });
    if (!["individual", "team", "performance"].includes(payload.eventType)) return NextResponse.json({ success: false, message: "Choose a valid participation type" }, { status: 400 });
    const code = String(payload.code).trim().toLowerCase();
    if (code !== event.code && await Event.exists({ code })) return NextResponse.json({ success: false, message: "Event code already exists" }, { status: 409 });
    const eventName = await EventName.findOneAndUpdate({ name: payload.name.trim() }, { $setOnInsert: { name: payload.name.trim() } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const category = await Category.findOneAndUpdate({ name: payload.category.trim() }, { $setOnInsert: { name: payload.category.trim() } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const heads = await resolveUsersByEmails(payload.eventHeadEmails || [], "event heads");
    if (!heads.length) return NextResponse.json({ success: false, message: "Add at least one event head" }, { status: 400 });
    const coordinators = await resolveUsersByEmails(payload.coordinatorEmails || [], "coordinators");
    const coCoordinators = await resolveUsersByEmails(payload.coCoordinatorEmails || [], "co-coordinators");
    const oldPosterLink = event.posterLink;
    Object.assign(event, { code, eventNameId: eventName._id, categoryId: category._id, location: payload.location.trim(), startsAt, endsAt, description: payload.description.trim(), eventType: payload.eventType, minParticipants, maxParticipants, allowPerformanceTypes: Boolean(payload.allowPerformanceTypes), paymentRequired: payload.paymentRequired?.amount || payload.paymentRequired?.qrCodeUrl ? payload.paymentRequired : undefined, rulebookLink: payload.rulebookLink.trim(), posterLink: payload.posterLink.trim(), eventHeads: heads.map((user) => user._id), coordinators: coordinators.map((user) => user._id), coCoordinators: coCoordinators.map((user) => user._id) });
    await event.save();
    if (oldPosterLink !== event.posterLink) await deletePosterImage(oldPosterLink);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin event update error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not update event" }, { status: error.status || 500 });
  }
}
