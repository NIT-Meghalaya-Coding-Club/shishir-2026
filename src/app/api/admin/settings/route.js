import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getAccessSettings, normalizeEmails, updateAccessSettings } from "@/lib/accessSettings";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();

  const settings = await getAccessSettings();
  return NextResponse.json({
    success: true,
    settings: {
      eventCreatorEmails: settings.eventCreatorEmails,
      committeeHeadEmails: settings.committeeHeadEmails,
    },
  });
}

export async function PATCH(req) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const payload = await req.json();
    const settings = await updateAccessSettings({
      eventCreatorEmails: normalizeEmails(payload.eventCreatorEmails),
      committeeHeadEmails: normalizeEmails(payload.committeeHeadEmails),
    });

    return NextResponse.json({
      success: true,
      settings: {
        eventCreatorEmails: settings.eventCreatorEmails,
        committeeHeadEmails: settings.committeeHeadEmails,
      },
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    return NextResponse.json({ success: false, message: "Could not update settings" }, { status: 500 });
  }
}
