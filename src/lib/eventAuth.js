import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

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

export function snapshotUser(user) {
  return {
    user: user._id,
    collegeID: user.collegeID,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  };
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
