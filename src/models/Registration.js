import mongoose from "mongoose";

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
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
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
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);


RegistrationSchema.index({ userId: 1, eventId: 1 });

const cachedRegistration = mongoose.models.Registration;
const cachedTeamDataSchema = cachedRegistration?.schema.path("teamData")?.caster?.schema;

// Drop a development-process model created from the previous embedded-member schema.
if (cachedTeamDataSchema?.path("name")) {
  delete mongoose.models.Registration;
}

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);