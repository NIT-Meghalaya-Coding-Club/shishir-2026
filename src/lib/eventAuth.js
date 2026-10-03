import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { getAccessSettings } from "@/lib/accessSettings";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { session: null, user: null };
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });

  return { session, user };
}

function userMatches(personRef, userOrEmail) {
  if (!personRef || !userOrEmail) return false;

  const refId = String(personRef?._id || personRef?.user || personRef || "").trim();
  const refEmail = String(personRef?.email || "").trim().toLowerCase();

  if (typeof userOrEmail === "object" && userOrEmail !== null) {
    const targetId = String(userOrEmail._id || userOrEmail.id || "").trim();
    const targetEmail = String(userOrEmail.email || "").trim().toLowerCase();

    if (targetId && refId && targetId === refId) return true;
    if (targetEmail && refEmail && targetEmail === refEmail) return true;
    return false;
  }

  const targetStr = String(userOrEmail || "").trim();
  if (!targetStr) return false;

  if (targetStr.includes("@")) {
    const targetEmail = targetStr.toLowerCase();
    if (refEmail && refEmail === targetEmail) return true;
  }

  if (refId && targetStr === refId) return true;

  return false;
}

export function isEventHead(event, userOrEmail) {
  if (!event || !userOrEmail) return false;

  return (event.eventHeads || []).some((head) => userMatches(head, userOrEmail));
}

export function isEventHeadOrCoordinator(event, userOrEmail) {
  if (!event || !userOrEmail) return false;

  const inHeads = (event.eventHeads || []).some((head) => userMatches(head, userOrEmail));
  if (inHeads) return true;

  const inCoords = (event.coordinators || []).some((coord) => userMatches(coord, userOrEmail));
  if (inCoords) return true;

  return (event.coCoordinators || []).some((coCoord) => userMatches(coCoord, userOrEmail));
}

export async function canCreateEvents(user) {
  if (!user?.email) return false;
  const settings = await getAccessSettings();
  return settings.eventCreatorEmails.includes(user.email.toLowerCase());
}

export function isCommitteeHead(committee, userOrEmail) {
  if (!committee || !userOrEmail) return false;

  return (committee.committeeHeads || []).some((head) => userMatches(head, userOrEmail));
}

export function isCommitteeHeadOrCoordinator(committee, userOrEmail) {
  if (!committee || !userOrEmail) return false;

  const inHeads = (committee.committeeHeads || []).some((head) => userMatches(head, userOrEmail));
  if (inHeads) return true;

  const inCoords = (committee.coordinators || []).some((coord) => userMatches(coord, userOrEmail));
  if (inCoords) return true;

  return (committee.coCoordinators || []).some((coCoord) => userMatches(coCoord, userOrEmail));
}

export async function canCreateCommittees(user) {
  if (!user?.email) return false;
  const settings = await getAccessSettings();
  return settings.committeeHeadEmails.includes(user.email.toLowerCase());
}

export async function canAccessMunDashboard(user) {
  if (!user?.email) return false;
  const settings = await getAccessSettings();
  return settings.munDashboardEmails.includes(user.email.toLowerCase());
}

export async function hydrateEventPeople(events) {
  const eventList = Array.isArray(events) ? events : [events];
  return eventList.map((event) => ({
    ...event,
    eventHeads: event.eventHeads || [],
    coordinators: event.coordinators || [],
    coCoordinators: event.coCoordinators || [],
  }));
}

export async function resolveUsersByCollegeIDs(collegeIDs = [], label = "users") {
  const normalizedIDs = [...new Set(
    collegeIDs.map((collegeID) => String(collegeID || "").trim()).filter(Boolean)
  )];

  if (normalizedIDs.length === 0) return [];

  const users = await User.find({ collegeID: { $in: normalizedIDs } });
  const byCollegeID = new Map(users.map((user) => [user.collegeID, user]));
  const missing = normalizedIDs.filter((collegeID) => !byCollegeID.has(collegeID));

  if (missing.length > 0) {
    const error = new Error(`Could not find ${label}: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }

  const incomplete = users.filter((user) => !user.name || !user.email || !user.collegeID);
  if (incomplete.length > 0) {
    const error = new Error(
      `${label} must have completed profiles: ${incomplete
        .map((user) => user.collegeID || user.email)
        .join(", ")}`
    );
    error.status = 400;
    throw error;
  }

  return normalizedIDs.map((collegeID) => byCollegeID.get(collegeID));
}

export async function resolveUsersByEmails(
  emails = [],
  label = "users",
  allowIncomplete = false
) {
  const normalizedEmails = [...new Set(
    emails.map((email) => String(email || "").trim().toLowerCase()).filter(Boolean)
  )];

  if (normalizedEmails.length === 0) return [];

  const users = await User.find({ email: { $in: normalizedEmails } });
  const byEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
  const missing = normalizedEmails.filter((email) => !byEmail.has(email));

  if (missing.length > 0) {
    const error = new Error(`Could not find ${label}: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }

  const incomplete = users.filter((user) => !user.name || !user.email || !user.collegeID);
  if (!allowIncomplete && incomplete.length > 0) {
    const error = new Error(
      `${label} must have completed profiles: ${incomplete
        .map((user) => user.collegeID || user.email)
        .join(", ")}`
    );
    error.status = 400;
    throw error;
  }

  return normalizedEmails.map((email) => byEmail.get(email));
}
