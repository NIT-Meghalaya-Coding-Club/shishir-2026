import { deleteOwnedProfileImage } from '@/lib/r2';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

const NIT_COLLEGE = "National Institute of Technology, Meghalaya";
const COLLEGE_ID_PATTERN = /[A-Za-z]\d{2}[A-Za-z]{2}\d{3}/;

export async function POST(req, { params }) {
    try {
        await connectMongo();

        const { id } = await params;
        const email = decodeURIComponent(id || "");
        const formData = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ success: false, error: "Email is required." }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found." }), { status: 404 });
        }

        const nextFormData = { ...formData };
        if (nextFormData.college === NIT_COLLEGE) {
            const collegeID = email.split("@")[0].match(COLLEGE_ID_PATTERN)?.[0].toLowerCase();
            if (!collegeID) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Your email must contain a college ID in the format 1 letter, 2 numbers, 2 letters, and 3 numbers.",
                }), { status: 400 });
            }
            nextFormData.collegeID = collegeID;
        }

        const oldImage = existingUser.image;
        const user = await User.findOneAndUpdate(
            { email },
            { $set: nextFormData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found." }), { status: 404 });
        }

        user.registered = true;

        await user.save();

        if (nextFormData.image && nextFormData.image !== oldImage) {
            await deleteOwnedProfileImage(oldImage, user._id.toString());
        }

        return new Response(JSON.stringify({ success: true, user }), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || "Internal server error.",
        }), { status: 500 });
    }
}
