import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["individual", "team", "performance"],
      required: true,
      default: "team",
    },
    minParticipants: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
      validate: {
        validator(value) {
          return value >= this.minParticipants;
        },
        message: "Maximum participants must be at least the minimum participants",
      },
    },
    allowPerformanceTypes: {
      type: Boolean,
      default: false,
    },
    paymentRequired: {
      amount: { type: Number, min: 0 },
      qrCodeUrl: { type: String, trim: true },
    },
    rulebookLink: {
      type: String,
      required: true,
      trim: true,
    },
    posterLink: {
      type: String,
      required: true,
      trim: true,
    },
    eventHeads: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      validate: {
        validator: (heads) => Array.isArray(heads) && heads.length > 0,
        message: "At least one event head is required",
      },
    },
    coordinators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    coCoordinators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

EventSchema.index({ eventHeads: 1 });
EventSchema.index({ coordinators: 1 });
EventSchema.index({ coCoordinators: 1 });

const cachedEvent = mongoose.models.Event;
const cachedEventHeadsSchema = cachedEvent?.schema.path("eventHeads")?.caster?.schema;

// Drop a development-process model created from the previous embedded snapshot schema.
if (cachedEventHeadsSchema?.path("name")) {
  delete mongoose.models.Event;
}

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
