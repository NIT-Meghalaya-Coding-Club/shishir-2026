import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
  },
});

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
      index: true, 
    },
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
      trim: true,
      index: true,
    },
    teamData: {
      type: [TeamMemberSchema],
      required: [true, "At least one team member is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "Team data cannot be empty",
      },
    },
    metadata: {
      eventType: {
        type: String,
        enum: ["individual", "team", "performance"],
        default: "team",
      },
      groupName: {
        type: String,
        trim: true,
      },
      performanceType: {
        type: String,
        enum: ["solo", "duo", "trio", "group", null],
        default: null,
      },
      dynamicEventCode: {
        type: String,
        trim: true,
      },
      dynamicEventType: {
        type: String,
        trim: true,
      },
      minParticipants: {
        type: Number,
        min: 1,
      },
      maxParticipants: {
        type: Number,
        min: 1,
      },
      utensilsRequired: {
        type: String,
        trim: true,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);


RegistrationSchema.index({ userId: 1, eventId: 1 });

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);