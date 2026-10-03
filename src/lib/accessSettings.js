import connectMongo from "@/lib/mongodb";
import AppSettings from "@/models/AppSettings";
import mongoose from "mongoose";

function envEmails(name) {
  return String(process.env[name] || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeEmails(emails) {
  return [...new Set((Array.isArray(emails) ? emails : [])
    .map((email) => String(email || "").trim().toLowerCase())
    .filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function normalizeCommitteeOrder(ids) {
  return [...new Set((Array.isArray(ids) ? ids : [])
    .map((id) => String(id || "").trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id)))];
}

export async function getAccessSettings() {
  await connectMongo();
  return AppSettings.findOneAndUpdate(
    { key: "access-control" },
    {
      $setOnInsert: {
        eventCreatorEmails: envEmails("EVENT_CREATOR_EMAILS"),
        committeeHeadEmails: envEmails("COMMITTEE_HEAD_EMAILS"),
        munDashboardEmails: envEmails("MUN_DASHBOARD_EMAILS"),
        committeeOrder: [],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export async function updateAccessSettings({ eventCreatorEmails, committeeHeadEmails, munDashboardEmails, committeeOrder }) {
  await connectMongo();
  return AppSettings.findOneAndUpdate(
    { key: "access-control" },
    {
      $set: {
        eventCreatorEmails: normalizeEmails(eventCreatorEmails),
        committeeHeadEmails: normalizeEmails(committeeHeadEmails),
        munDashboardEmails: normalizeEmails(munDashboardEmails),
        committeeOrder: normalizeCommitteeOrder(committeeOrder),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export { normalizeEmails, normalizeCommitteeOrder };