import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { session: null, user: null };
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });

  return { session, user };
}

export function isEventHead(event, email) {
  if (!event || !email) return false;

  return event.eventHeads.some(
    (head) => head.email?.toLowerCase() === email.toLowerCase()
  );
}

export function canCreateEvents(user) {
  if (!user?.email) return false;

  const allowedEmails = String(process.env.EVENT_CREATOR_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email.toLowerCase());
}

export function isCommitteeHead(committee, email) {
  if (!committee || !email) return false;

  return committee.committeeHeads.some(
    (head) => head.email?.toLowerCase() === email.toLowerCase()
  );
}

export function canCreateCommittees(user) {
  if (!user?.email) return false;

  const allowedEmails = String(process.env.NEXT_PUBLIC_COMMITTEE_HEAD_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email.toLowerCase());
}

export function snapshotUser(user) {
  return {
    user: user._id,
    collegeID: user.collegeID,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    image: user.image || "",
  };
}

export async function hydrateEventPeople(events) {
  const eventList = Array.isArray(events) ? events : [events];
  const people = eventList.flatMap((event) => [
    ...(event?.eventHeads || []),
    ...(event?.coordinators || []),
    ...(event?.coCoordinators || []),
  ]);

  const validUserIDs = [...new Set(
    people
      .map((person) => String(person?.user || ""))
      .filter((userID) => mongoose.Types.ObjectId.isValid(userID))
  )];
  const emails = [...new Set(
    people
      .map((person) => String(person?.email || "").trim().toLowerCase())
      .filter(Boolean)
  )];
  const collegeIDs = [...new Set(
    people
      .map((person) => String(person?.collegeID || "").trim())
      .filter(Boolean)
  )];

  if (validUserIDs.length === 0 && emails.length === 0 && collegeIDs.length === 0) {
    return eventList.map((event) => ({
      ...event,
      eventHeads: event.eventHeads || [],
      coordinators: event.coordinators || [],
      coCoordinators: event.coCoordinators || [],
    }));
  }

  const users = await User.find({
    $or: [
      ...(validUserIDs.length > 0 ? [{ _id: { $in: validUserIDs } }] : []),
      ...(emails.length > 0 ? [{ email: { $in: emails } }] : []),
      ...(collegeIDs.length > 0 ? [{ collegeID: { $in: collegeIDs } }] : []),
    ],
  }).select("image email collegeID").lean();

  const usersByKey = new Map();
  users.forEach((user) => {
    usersByKey.set(`id:${String(user._id)}`, user);
    if (user.email) usersByKey.set(`email:${user.email.toLowerCase()}`, user);
    if (user.collegeID) usersByKey.set(`collegeID:${user.collegeID}`, user);
  });

  const addImages = (group = []) => group.map((person) => {
    const user = usersByKey.get(`id:${String(person.user || "")}`)
      || usersByKey.get(`email:${String(person.email || "").trim().toLowerCase()}`)
      || usersByKey.get(`collegeID:${String(person.collegeID || "").trim()}`);

    return {
      ...person,
      image: user?.image || person.image || "",
    };
  });

  return eventList.map((event) => ({
    ...event,
    eventHeads: addImages(event.eventHeads),
    coordinators: addImages(event.coordinators),
    coCoordinators: addImages(event.coCoordinators),
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

  return normalizedIDs.map((collegeID) => snapshotUser(byCollegeID.get(collegeID)));
}
