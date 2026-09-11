import connectMongo from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/eventAuth";
import mongoose from "mongoose";

async function getRegistrationPayload(payload, leaderEmail) {
  const teamData = Array.isArray(payload.teamData) ? payload.teamData : [];
  const requestedEmails = teamData
    .map((member) => (typeof member?.email === "string" ? member.email.trim().toLowerCase() : ""))
    .filter(Boolean);
  const emails = [leaderEmail.trim().toLowerCase(), ...requestedEmails.filter((email) => email !== leaderEmail.trim().toLowerCase())];
  const uniqueEmails = [...new Set(emails)];
  const users = await User.find({ email: { $in: uniqueEmails } }).select("_id email").lean();
  const usersByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
  const missingEmail = uniqueEmails.find((email) => !usersByEmail.has(email));

  if (!usersByEmail.has(leaderEmail.trim().toLowerCase())) {
    return { error: "Your user profile could not be found." };
  }
  if (missingEmail) {
    return { error: `No user was found for ${missingEmail}. Search for a registered email address.` };
  }

  return {
    teamData: uniqueEmails.map((email) => usersByEmail.get(email)._id),
    metadata: {
      eventType: payload.metadata?.eventType || "team",
      groupName: payload.metadata?.groupName || undefined,
      performanceType: payload.metadata?.performanceType || null,
      dynamicEventCode: payload.metadata?.dynamicEventCode || undefined,
      dynamicEventType: payload.metadata?.dynamicEventType || undefined,
      minParticipants: payload.metadata?.minParticipants || undefined,
      maxParticipants: payload.metadata?.maxParticipants || undefined,
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
    const showAll = new URL(req.url).searchParams.get("all") === "true";

    if (!session?.user?.email || !eventId) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const registrations = await Registration.find({
      userId: session.user.email,
      ...(showAll ? {} : { eventId }),
    }).populate("teamData", "name email phone collegeID").sort({ createdAt: -1 }).lean();

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
    const { session } = await getCurrentUser();
    if (!session?.user?.email) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { eventId, teamData, metadata } = await req.json();

    // Basic validation for required fields
    if (!eventId || !Array.isArray(teamData) || teamData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "eventId and teamData are required, and teamData must be an array with at least one member!",
        }),
        { status: 400 }
      );
    }

    const registrationPayload = await getRegistrationPayload({ teamData, metadata }, session.user.email);
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
      userId: session.user.email,
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

    await connectMongo();
    const registrationPayload = await getRegistrationPayload({ teamData, metadata }, session.user.email);
    if (registrationPayload.error) {
      return Response.json({ success: false, message: registrationPayload.error }, { status: 400 });
    }

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