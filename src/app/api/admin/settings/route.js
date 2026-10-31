import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import CommitteeName from "@/models/CommitteeName";
import { getAccessSettings, normalizeEmails, normalizeCommitteeOrder, normalizeScheduleDates, updateAccessSettings } from "@/lib/accessSettings";

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
      scheduleDates: settings.scheduleDates || { day1: "", day2: "", day3: "" },
      stopAcceptingParticipationSiteWide: Boolean(settings.stopAcceptingParticipationSiteWide),
    },
  });
}

export async function PATCH(req) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const payload = await req.json();
    const updates = {};

    if (payload.eventCreatorEmails !== undefined) {
      updates.eventCreatorEmails = payload.eventCreatorEmails;
    }
    if (payload.committeeHeadEmails !== undefined) {
      updates.committeeHeadEmails = payload.committeeHeadEmails;
    }
    if (payload.munDashboardEmails !== undefined) {
      updates.munDashboardEmails = payload.munDashboardEmails;
    }
    if (payload.scheduleDates !== undefined) {
      updates.scheduleDates = payload.scheduleDates;
    }
    if (payload.stopAcceptingParticipationSiteWide !== undefined) {
      updates.stopAcceptingParticipationSiteWide = payload.stopAcceptingParticipationSiteWide;
    }
    if (payload.committeeOrder !== undefined) {
      const committeeOrder = normalizeCommitteeOrder(payload.committeeOrder);
      const committeeNameCount = await CommitteeName.countDocuments({ _id: { $in: committeeOrder } });
      if (committeeNameCount !== committeeOrder.length) {
        return NextResponse.json({ success: false, message: "Committee order contains an unknown committee" }, { status: 400 });
      }
      updates.committeeOrder = committeeOrder;
    }

    const settings = await updateAccessSettings(updates);

    return NextResponse.json({
      success: true,
      settings: {
        eventCreatorEmails: settings.eventCreatorEmails,
        committeeHeadEmails: settings.committeeHeadEmails,
        munDashboardEmails: settings.munDashboardEmails || [],
        committeeOrder: (settings.committeeOrder || []).map(String),
        scheduleDates: settings.scheduleDates || { day1: "", day2: "", day3: "" },
        stopAcceptingParticipationSiteWide: Boolean(settings.stopAcceptingParticipationSiteWide),
      },
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    return NextResponse.json({ success: false, message: "Could not update settings" }, { status: 500 });
  }
}
