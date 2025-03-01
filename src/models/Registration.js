import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        match: /.+\@.+\..+/ // Basic email validation
    },
    phone: {
        type: String,
    }
});

const RegistrationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    eventCode: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
    },
    teamMembers: {
        type: [TeamMemberSchema],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);
