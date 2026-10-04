import mongoose from "mongoose";

const AppSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "access-control" },
    eventCreatorEmails: { type: [String], default: [] },
    committeeHeadEmails: { type: [String], default: [] },
    munDashboardEmails: { type: [String], default: [] },
    committeeOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommitteeName" }],
    scheduleDates: {
      day1: { type: String, default: "" },
      day2: { type: String, default: "" },
      day3: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettingsSchema);