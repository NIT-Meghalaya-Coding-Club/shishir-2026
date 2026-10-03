import mongoose from "mongoose";

const EventNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EventName ||
  mongoose.model("EventName", EventNameSchema);
