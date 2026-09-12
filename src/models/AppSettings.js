import mongoose from "mongoose";

const AppSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "access-control" },
    eventCreatorEmails: { type: [String], default: [] },
    committeeHeadEmails: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettingsSchema);