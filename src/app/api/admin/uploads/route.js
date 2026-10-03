import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Upload from "@/models/Uploads";
import User from "@/models/User";
import Event from "@/models/Event";
import EventName from "@/models/EventName";
import { deleteOwnedProfileImage, deletePosterImage, getPosterPublicUrl } from "@/lib/r2";

export const runtime = "nodejs";

const PAGE_SIZE = 20;

function serializeUpload(upload, users, events) {
  const user = upload.userId ? users.get(String(upload.userId)) : null;
  const reference = upload.referenceType === "User"
    ? users.get(String(upload.referenceId))
    : events.get(String(upload.referenceId));
  const imageUrl = upload.type === "poster"
    ? getPosterPublicUrl(reference?.posterLink)
    : reference?.image || null;

  return {
    id: String(upload._id),
    type: upload.type,
    imageUrl,
    eventName: upload.type === "poster" && reference?.eventNameId?.name
      ? reference.eventNameId.name
      : null,
    uploader: user
      ? { name: user.name || "Unnamed user", email: user.email }
      : { name: "Admin", email: null },
    isProcessed: Boolean(upload.isProcessed),
    originalSize: upload.originalSize || 0,
    processedSize: upload.processedSize || 0,
    createdAt: upload.createdAt,
    updatedAt: upload.updatedAt,
  };
}

export async function GET(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  }

  try {
    await connectMongo();
    const search = new URL(request.url).searchParams.get("search")?.trim() || "";
    const pageParam = Number(new URL(request.url).searchParams.get("page") || 1);
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const uploadFilter = {};
    if (search) {
      const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const [matchingUsers, matchingEventNames] = await Promise.all([
        User.find({ $or: [{ name: expression }, { email: expression }] }).select("_id").lean(),
        EventName.find({ name: expression }).select("_id").lean(),
      ]);
      const matchingEvents = await Event.find({ eventNameId: { $in: matchingEventNames.map((item) => item._id) } }).select("_id").lean();
      const userIds = matchingUsers.map((user) => user._id);
      const eventIds = matchingEvents.map((event) => event._id);
      uploadFilter.$or = [
        { userId: { $in: userIds } },
        { referenceId: { $in: userIds }, referenceType: "User" },
        { referenceId: { $in: eventIds }, referenceType: "Event" },
      ];
    }
    const [total, uploads] = await Promise.all([
      Upload.countDocuments(uploadFilter),
      Upload.find(uploadFilter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    ]);

    const userIds = new Set();
    const eventIds = new Set();
    uploads.forEach((upload) => {
      if (upload.userId) userIds.add(String(upload.userId));
      if (upload.referenceType === "User") userIds.add(String(upload.referenceId));
      if (upload.referenceType === "Event") eventIds.add(String(upload.referenceId));
    });
    const [users, events] = await Promise.all([
      User.find({ _id: { $in: [...userIds] } }).select("name email image").lean(),
      Event.find({ _id: { $in: [...eventIds] } }).select("posterLink eventNameId").populate("eventNameId", "name").lean(),
    ]);

    return NextResponse.json({
      success: true,
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      uploads: uploads.map((upload) => serializeUpload(
        upload,
        new Map(users.map((user) => [String(user._id), user])),
        new Map(events.map((event) => [String(event._id), event])),
      )),
    });
  } catch (error) {
    console.error("Admin uploads error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not load uploads" }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { id } = await request.json();
    const upload = await Upload.findById(id);
    if (!upload) return NextResponse.json({ success: false, message: "Upload not found" }, { status: 404 });

    if (upload.referenceType === "Event") {
      const event = await Event.findById(upload.referenceId);
      if (event && upload.type === "poster") {
        const posterLink = event.posterLink;
        event.posterLink = "";
        await event.save();
        await deletePosterImage(posterLink);
      }
    } else if (upload.referenceType === "User") {
      const user = await User.findById(upload.referenceId);
      if (user && upload.type !== "poster" && user.image) {
        await deleteOwnedProfileImage(user.image, String(user._id));
        user.image = null;
        await user.save();
      }
    }

    await Upload.findByIdAndDelete(upload._id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin upload deletion error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not delete upload" }, { status: 500 });
  }
}
