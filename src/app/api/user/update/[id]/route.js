import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req, { params }) {
    try {
        await connectMongo();

        const { id } = await params;
        const email = decodeURIComponent(id || "");
        const formData = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ success: false, error: "Email is required." }), { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: formData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found." }), { status: 404 });
        }

        user.registered = true;

        await user.save();

        return new Response(JSON.stringify({ success: true, user }), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || "Internal server error.",
        }), { status: 500 });
    }
}
