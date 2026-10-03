import mongoose from "mongoose";

const AppSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "access-control" },
    eventCreatorEmails: { type: [String], default: [] },
    committeeHeadEmails: { type: [String], default: [] },
    munDashboardEmails: { type: [String], default: [] },
    committeeOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommitteeName" }],
  },
  { timestamps: true }
);

export default mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettingsSchema);