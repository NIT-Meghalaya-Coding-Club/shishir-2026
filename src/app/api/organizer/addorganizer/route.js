// src/api/admin/addorganizer
import connectMongo from "../../../../lib/mongodb";
import Organizer from "../../../../models/Organizer";
import { hashPassword } from "../../../../lib/bcrypt";

export const POST = async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method Not Allowed" }),
        { status: 405 }
      );
    }

    await connectMongo();

    const { events } = await req.json();

    // Validate the input
    if (!events) {
      console.log("Missing fields!");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const existingOrganizers = [];

    for (const event of events) {
      const { name, eventCode, password } = event;
      if (!name || !eventCode || !password) {
        console.log("Missing", event);
        continue;
      }
      const existingOrganizer = await Organizer.findOne({ eventCode });
      if (existingOrganizer) {
        existingOrganizers.push(existingOrganizer);
        continue;
      }

      const hashedPassword = await hashPassword(password);
      const organizer = new Organizer({
        name: name,
        eventCode: eventCode,
        password: hashedPassword,
      });
      await organizer.save();
    }

    return new Response(
      JSON.stringify({ success: true, message: "Organizer created", existingOrganizers }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server Error" }),
      { status: 500 }
    );
  }
};
