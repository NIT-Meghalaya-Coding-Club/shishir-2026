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

function normalizeScheduleDates(dates) {
  return ["day1", "day2", "day3"].reduce((result, day) => {
    const value = String(dates?.[day] || "").trim();
    result[day] = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
    return result;
  }, {});
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
        scheduleDates: { day1: "", day2: "", day3: "" },
        stopAcceptingParticipationSiteWide: false,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export async function updateAccessSettings(updates = {}) {
  await connectMongo();
  const setObj = {};
  if (updates.eventCreatorEmails !== undefined) {
    setObj.eventCreatorEmails = normalizeEmails(updates.eventCreatorEmails);
  }
  if (updates.committeeHeadEmails !== undefined) {
    setObj.committeeHeadEmails = normalizeEmails(updates.committeeHeadEmails);
  }
  if (updates.munDashboardEmails !== undefined) {
    setObj.munDashboardEmails = normalizeEmails(updates.munDashboardEmails);
  }
  if (updates.committeeOrder !== undefined) {
    setObj.committeeOrder = normalizeCommitteeOrder(updates.committeeOrder);
  }
  if (updates.scheduleDates !== undefined) {
    setObj.scheduleDates = normalizeScheduleDates(updates.scheduleDates);
  }
  if (updates.stopAcceptingParticipationSiteWide !== undefined) {
    setObj.stopAcceptingParticipationSiteWide = Boolean(updates.stopAcceptingParticipationSiteWide);
  }

  return AppSettings.findOneAndUpdate(
    { key: "access-control" },
    {
      $set: setObj,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}

export { normalizeEmails, normalizeCommitteeOrder, normalizeScheduleDates };