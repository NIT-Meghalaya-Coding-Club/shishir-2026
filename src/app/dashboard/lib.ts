export function canCreateEvents(user: { email?: string | null } | null | undefined) {
  if (!user?.email) return false;

  const allowedEmails = String(process.env.NEXT_PUBLIC_EVENT_CREATOR_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email.toLowerCase());
}

export function canCreateCommittees(user: { email?: string | null } | null | undefined) {
  if (!user?.email) return false;

  const allowedEmails = String(process.env.NEXT_PUBLIC_COMMITTEE_HEAD_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email.toLowerCase());
}