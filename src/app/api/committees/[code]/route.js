import { NextResponse } from "next/server";
import Committee from "@/models/Committee";
import {
  getCurrentUser,
  isCommitteeHead,
  isCommitteeHeadOrCoordinator,
  resolveUsersByCollegeIDs,
  resolveUsersByEmails,
} from "@/lib/eventAuth";

function normalizeCode(code) {
  return String(code || "").trim().toLowerCase();
}

function validateCommitteePayload(payload) {
  const missing = ["name"].filter(
    (field) => !String(payload[field] || "").trim()
  );

  return missing.length > 0
    ? `Missing required fields: ${missing.join(", ")}`
    : null;
}

export async function PATCH(req, { params }) {
  try {
    const { code } = await params;
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const committee = await Committee.findOne({ code: normalizeCode(code) });

    if (!committee) {
      return NextResponse.json(
        { success: false, message: "Committee not found" },
        { status: 404 }
      );
    }

    if (!isCommitteeHeadOrCoordinator(committee, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only committee heads or coordinators can edit committee details" },
        { status: 403 }
      );
    }

    const payload = await req.json();
    const validationError = validateCommitteePayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const userIsHead = isCommitteeHead(committee, user.email);

    const committeeHeadEmails = Array.isArray(payload.committeeHeadEmails)
      ? (userIsHead ? [...new Set([...payload.committeeHeadEmails, user.email])] : payload.committeeHeadEmails)
      : null;
    const committeeHeads = committeeHeadEmails
      ? await resolveUsersByEmails(committeeHeadEmails, "committee heads")
      : null;

    const coordinatorEmails = Array.isArray(payload.coordinatorEmails)
      ? (!userIsHead ? [...new Set([...payload.coordinatorEmails, user.email])] : payload.coordinatorEmails)
      : null;
    const coordinators = coordinatorEmails
      ? await resolveUsersByEmails(coordinatorEmails, "coordinators", true)
      : null;

    const coCoordinators = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators")
      : null;

    const committeeHeadIDs = Array.isArray(payload.committeeHeadCollegeIDs)
      ? payload.committeeHeadCollegeIDs
      : committee.committeeHeads.map((head) => head.collegeID);

    if (userIsHead && user.collegeID && !committeeHeadIDs.includes(user.collegeID)) {
      committeeHeadIDs.push(user.collegeID);
    }

    const coordinatorIDs = Array.isArray(payload.coordinatorCollegeIDs)
      ? payload.coordinatorCollegeIDs
      : committee.coordinators.map((c) => c.collegeID);

    if (!userIsHead && user.collegeID && !coordinatorIDs.includes(user.collegeID)) {
      coordinatorIDs.push(user.collegeID);
    }

    committee.name = payload.name;
    committee.committeeHeads = committeeHeads || await resolveUsersByCollegeIDs(
      committeeHeadIDs,
      "committee heads"
    );
    committee.coordinators = coordinators || await resolveUsersByCollegeIDs(
      coordinatorIDs,
      "coordinators"
    );
    committee.coCoordinators = coCoordinators || await resolveUsersByCollegeIDs(
      Array.isArray(payload.coCoordinatorCollegeIDs)
        ? payload.coCoordinatorCollegeIDs
        : [],
      "co-coordinators"
    );

    await committee.save();

    return NextResponse.json({ success: true, committee }, { status: 200 });
  } catch (error) {
    console.error("Update committee error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { code } = await params;
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const committee = await Committee.findOne({ code: normalizeCode(code) });

    if (!committee) {
      return NextResponse.json(
        { success: false, message: "Committee not found" },
        { status: 404 }
      );
    }

    if (!isCommitteeHeadOrCoordinator(committee, user.email)) {
      return NextResponse.json(
        { success: false, message: "Only committee heads or coordinators can delete committees" },
        { status: 403 }
      );
    }

    await committee.deleteOne();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete committee error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}