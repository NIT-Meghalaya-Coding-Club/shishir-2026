import connectMongo from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { getSession } from "next-auth/react";

export async function POST(req) {
  try {
    await connectMongo();
    
    const { eventCode, userId } = await req.json();

    if(!eventCode || !userId)
        return new Response(JSON.stringify({ success: false, message: "All fields are required!" }), { status: 404 });

    // console.log(userId, "\n\n")
    // console.log("Session:\n")
    // console.log(session, "\n\n")

    // Check if already registered
    const existingRegistration = await Registration.findOne({ userId, eventCode });
    if (existingRegistration) {
      return new Response(JSON.stringify({ success: false, message: "Already registered for this event" }), { status: 400 });
    }

    // Save new registration
    const registration = new Registration({ userId, eventCode });
    await registration.save();

    return new Response(JSON.stringify({ success: true, message: "Registration successful" }), { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
}
