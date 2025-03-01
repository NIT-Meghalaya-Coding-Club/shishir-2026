// src/api/admin/addorganizer
import connectMongo from '../../../../lib/mongodb';
import Organizer from '../../../../models/Organizer';
import { hashPassword } from '../../../../lib/bcrypt';

export const POST = async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        await connectMongo();

        const { name, eventCode, password } = await req.json();

        // Validate the input
        if (!name || !eventCode || !password) {
            console.log("Missing fields!", name, eventCode, password);
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        // Check if the organizer already exists
        const existingOrganizer = await Organizer.findOne({ $or: [{ eventCode: eventCode }] });

        // console.log(existingOrganizer)

        if (existingOrganizer) {
            return new Response(JSON.stringify({ success: false, message: 'Organizer already exists' }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        const organizer = new Organizer({
            name: name,
            eventCode: eventCode,
            password: hashedPassword,
        });

        await organizer.save();

        return new Response(JSON.stringify({ success: true, message: "Organizer created" }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
};
