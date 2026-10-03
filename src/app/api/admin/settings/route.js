import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import CommitteeName from "@/models/CommitteeName";
import { getAccessSettings, normalizeEmails, normalizeCommitteeOrder, updateAccessSettings } from "@/lib/accessSettings";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();

  const settings = await getAccessSettings();
  const committeeNames = await CommitteeName.find().select("name").sort({ name: 1 }).lean();
  return NextResponse.json({
    success: true,
    settings: {
      eventCreatorEmails: settings.eventCreatorEmails,
      committeeHeadEmails: settings.committeeHeadEmails,
      munDashboardEmails: settings.munDashboardEmails || [],
      committeeOrder: (settings.committeeOrder || []).map(String),
      committeeNames,
    },
  });
}

export async function PATCH(req) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const payload = await req.json();
    const committeeOrder = normalizeCommitteeOrder(payload.committeeOrder);
    const committeeNameCount = await CommitteeName.countDocuments({ _id: { $in: committeeOrder } });
    if (committeeNameCount !== committeeOrder.length) {
      return NextResponse.json({ success: false, message: "Committee order contains an unknown committee" }, { status: 400 });
    }
    const settings = await updateAccessSettings({
      eventCreatorEmails: normalizeEmails(payload.eventCreatorEmails),
      committeeHeadEmails: normalizeEmails(payload.committeeHeadEmails),
      munDashboardEmails: normalizeEmails(payload.munDashboardEmails),
      committeeOrder,
    });

    return NextResponse.json({
      success: true,
      settings: {
        eventCreatorEmails: settings.eventCreatorEmails,
        committeeHeadEmails: settings.committeeHeadEmails,
        munDashboardEmails: settings.munDashboardEmails || [],
        committeeOrder: (settings.committeeOrder || []).map(String),
      },
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    return NextResponse.json({ success: false, message: "Could not update settings" }, { status: 500 });
  }
}
