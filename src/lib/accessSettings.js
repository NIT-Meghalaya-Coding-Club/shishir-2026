import connectMongo from "@/lib/mongodb";
import AppSettings from "@/models/AppSettings";

function envEmails(name) {
  return String(process.env[name] || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeEmails(emails) {
  return [...new Set((Array.isArray(emails) ? emails : [])
    .map((email) => String(email || "").trim().toLowerCase())
    .filter(Boolean))];
}

export async function getAccessSettings() {
  await connectMongo();
  return AppSettings.findOneAndUpdate(
    { key: "access-control" },
    {
      $setOnInsert: {
        eventCreatorEmails: envEmails("EVENT_CREATOR_EMAILS"),
        committeeHeadEmails: envEmails("NEXT_PUBLIC_COMMITTEE_HEAD_EMAILS"),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export async function updateAccessSettings({ eventCreatorEmails, committeeHeadEmails }) {
  await connectMongo();
  return AppSettings.findOneAndUpdate(
    { key: "access-control" },
    {
      $set: {
        eventCreatorEmails: normalizeEmails(eventCreatorEmails),
        committeeHeadEmails: normalizeEmails(committeeHeadEmails),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export { normalizeEmails };