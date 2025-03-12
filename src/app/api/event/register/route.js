import connectMongo from "@/lib/mongodb";
import Registration from "@/models/Registration";

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

    // Filter out invalid team members (require name, rollNumber, and phone)
    const validTeamMembers = teamData.filter(
      (member) => member.name && member.rollNumber && member.phone
    );

    if (validTeamMembers.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "At least one valid team member with name, rollNumber, and phone is required!",
        }),
        { status: 400 }
      );
    }

    // Check if already registered (using eventId instead of eventCode)
    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Already registered for this event",
        }),
        { status: 409 } // Changed to 409 Conflict for duplicate resource
      );
    }

    // Create new registration entry
    const registration = new Registration({
      userId,
      eventId, // Updated from eventCode to match schema and frontend
      teamData: validTeamMembers, // Updated from teamMembers to match schema and frontend
      metadata: {
        eventType: metadata?.eventType || "team", // Default to "team" if not provided
        groupName: metadata?.groupName || undefined,
        performanceType: metadata?.performanceType || null,
        dynamicEventCode: metadata?.dynamicEventCode || undefined,
        dynamicEventType: metadata?.dynamicEventType || undefined,
        minParticipants: metadata?.minParticipants || undefined,
        maxParticipants: metadata?.maxParticipants || undefined,
        utensilsRequired: metadata?.utensilsRequired || undefined,
      },
    });

    await registration.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful",
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