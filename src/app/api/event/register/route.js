import connectMongo from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function POST(req) {
  try {
    await connectMongo();

    const { eventId, userId, teamData } = await req.json();

    if (!eventId || !userId || !Array.isArray(teamData) || teamData.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "All fields are required, and teamData must be an array with at least one valid member!" }), { status: 400 });
    }

    // Filter out empty team members
    const validTeamMembers = teamData.filter(member => member.name && member.rollNumber && member.phone);

    if (validTeamMembers.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "At least one valid team member is required!" }), { status: 400 });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ userId, eventCode: eventId });
    if (existingRegistration) {
      return new Response(JSON.stringify({ success: false, message: "Already registered for this event" }), { status: 400 });
    }

    // Create new registration entry
    const registration = new Registration({
      userId,
      eventCode: eventId,
      teamMembers: validTeamMembers,
    });
    await registration.save();

    return new Response(JSON.stringify({ success: true, message: "Registration successful" }), { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
}