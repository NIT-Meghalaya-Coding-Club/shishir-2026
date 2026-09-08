import connectMongo from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { getCurrentUser } from "@/lib/eventAuth";
import mongoose from "mongoose";

function getRegistrationPayload(payload) {
  const teamData = Array.isArray(payload.teamData) ? payload.teamData : [];
  const validTeamMembers = teamData.filter(
    (member) => member.name && member.rollNumber && member.phone
  );

  if (validTeamMembers.length === 0) {
    return { error: "At least one valid team member with name, rollNumber, and phone is required!" };
  }

  return {
    teamData: validTeamMembers,
    metadata: {
      eventType: payload.metadata?.eventType || "team",
      groupName: payload.metadata?.groupName || undefined,
      performanceType: payload.metadata?.performanceType || null,
      dynamicEventCode: payload.metadata?.dynamicEventCode || undefined,
      dynamicEventType: payload.metadata?.dynamicEventType || undefined,
      minParticipants: payload.metadata?.minParticipants || undefined,
      maxParticipants: payload.metadata?.maxParticipants || undefined,
      utensilsRequired: payload.metadata?.utensilsRequired || undefined,
    },
  };
}

async function removeLegacyUniqueIndex() {
  const indexes = await Registration.collection.indexes();
  const legacyIndex = indexes.find(
    (index) =>
      index.unique &&
      index.key?.userId === 1 &&
      index.key?.eventId === 1 &&
      Object.keys(index.key).length === 2
  );

  if (legacyIndex) {
    await Registration.collection.dropIndex(legacyIndex.name);
  }
}

export async function GET(req) {
  try {
    const { session } = await getCurrentUser();
    const eventId = new URL(req.url).searchParams.get("eventId");

    if (!session?.user?.email || !eventId) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const registrations = await Registration.find({
      userId: session.user.email,
      eventId,
    }).sort({ createdAt: -1 }).lean();

    return Response.json(
      { success: true, registrations },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Fetch registration error:", error);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const { eventId, userId, teamData, metadata } = await req.json();

    // Basic validation for required fields
    if (!eventId || !userId || !Array.isArray(teamData) || teamData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "eventId, userId, and teamData are required, and teamData must be an array with at least one member!",
        }),
        { status: 400 }
      );
    }

    const registrationPayload = getRegistrationPayload({ teamData, metadata });
    if (registrationPayload.error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: registrationPayload.error,
        }),
        { status: 400 }
      );
    }

    // Create new registration entry
    const registration = new Registration({
      userId,
      eventId, // Updated from eventCode to match schema and frontend
      ...registrationPayload,
    });

    await removeLegacyUniqueIndex();
    try {
      await registration.save();
    } catch (error) {
      if (error?.code !== 11000) throw error;

      await removeLegacyUniqueIndex();
      await registration.save();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful",
        registrationId: registration._id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);

    // Handle specific Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server Error",
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { session } = await getCurrentUser();
    const { eventId, registrationId, teamData, metadata } = await req.json();

    if (!session?.user?.email || !eventId || !registrationId || !Array.isArray(teamData)) {
      return Response.json({ success: false, message: "eventId, registrationId and teamData are required" }, { status: 400 });
    }

    const registrationPayload = getRegistrationPayload({ teamData, metadata });
    if (registrationPayload.error) {
      return Response.json({ success: false, message: registrationPayload.error }, { status: 400 });
    }

    await connectMongo();
    const registration = await Registration.findOneAndUpdate(
      { _id: registrationId, userId: session.user.email, eventId },
      registrationPayload,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return Response.json({ success: false, message: "Registration not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Registration updated", registrationId: registration._id });
  } catch (error) {
    console.error("Update registration error:", error);
    return Response.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}