import mongoose from "mongoose";

const PersonSnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeID: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

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
      type: [PersonSnapshotSchema],
      required: true,
      validate: {
        validator: (heads) => Array.isArray(heads) && heads.length > 0,
        message: "At least one event head is required",
      },
    },
    coordinators: {
      type: [PersonSnapshotSchema],
      default: [],
    },
    coCoordinators: {
      type: [PersonSnapshotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

EventSchema.index({ "eventHeads.email": 1 });
EventSchema.index({ "eventHeads.collegeID": 1 });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
