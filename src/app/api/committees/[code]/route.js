import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import CommitteeName from "@/models/CommitteeName";
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

function withCommitteeName(committee) {
  if (!committee) return committee;
  committee.name = committee.committeeNameId?.name || committee.name || "";
  return committee;
}

async function resolveCommitteeName(payload) {
  if (payload.committeeNameId) {
    const committeeName = await CommitteeName.findById(payload.committeeNameId);
    if (committeeName) return committeeName;
  }

  const name = String(payload.name || "").trim().replace(/\s+/g, " ");
  return CommitteeName.findOneAndUpdate(
    { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    { $setOnInsert: { name } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
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

    await connectMongo();

    const committee = await Committee.findOne({ code: normalizeCode(code) })
      .populate("committeeNameId", "name")
      .populate("committeeHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy");

    if (!committee) {
      return NextResponse.json(
        { success: false, message: "Committee not found" },
        { status: 404 }
      );
    }

    if (!isCommitteeHeadOrCoordinator(committee, user)) {
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

    const userIsHead = isCommitteeHead(committee, user);
    const committeeName = await resolveCommitteeName(payload);

    const committeeHeadEmails = Array.isArray(payload.committeeHeadEmails)
      ? (userIsHead ? [...new Set([...payload.committeeHeadEmails, user.email])] : payload.committeeHeadEmails)
      : null;
    const committeeHeadUsers = committeeHeadEmails
      ? await resolveUsersByEmails(committeeHeadEmails, "committee heads")
      : null;

    const coordinatorEmails = Array.isArray(payload.coordinatorEmails)
      ? (!userIsHead ? [...new Set([...payload.coordinatorEmails, user.email])] : payload.coordinatorEmails)
      : null;
    const coordinatorUsers = coordinatorEmails
      ? await resolveUsersByEmails(coordinatorEmails, "coordinators", true)
      : null;

    const coCoordinatorEmails = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators", true)
      : null;

    const committeeHeadIDs = Array.isArray(payload.committeeHeadCollegeIDs)
      ? payload.committeeHeadCollegeIDs
      : (committee.committeeHeads || []).map((head) => head.collegeID).filter(Boolean);

    if (userIsHead && user.collegeID && !committeeHeadIDs.includes(user.collegeID)) {
      committeeHeadIDs.push(user.collegeID);
    }

    const coordinatorIDs = Array.isArray(payload.coordinatorCollegeIDs)
      ? payload.coordinatorCollegeIDs
      : (committee.coordinators || []).map((c) => c.collegeID).filter(Boolean);

    if (!userIsHead && user.collegeID && !coordinatorIDs.includes(user.collegeID)) {
      coordinatorIDs.push(user.collegeID);
    }

    const resolvedHeads = committeeHeadUsers || await resolveUsersByCollegeIDs(
      committeeHeadIDs,
      "committee heads"
    );
    const resolvedCoords = coordinatorUsers || await resolveUsersByCollegeIDs(
      coordinatorIDs,
      "coordinators"
    );
    const resolvedCoCoords = coCoordinatorEmails || await resolveUsersByCollegeIDs(
      Array.isArray(payload.coCoordinatorCollegeIDs)
        ? payload.coCoordinatorCollegeIDs
        : [],
      "co-coordinators"
    );

    committee.name = committeeName.name;
    committee.committeeNameId = committeeName._id;
    committee.committeeHeads = resolvedHeads.map((u) => u._id);
    committee.coordinators = resolvedCoords.map((u) => u._id);
    committee.coCoordinators = resolvedCoCoords.map((u) => u._id);

    await committee.save();
    await Committee.collection.updateOne(
      { _id: committee._id },
      { $unset: { name: "" } }
    );

    const populatedCommittee = await Committee.findById(committee._id)
      .populate("committeeNameId", "name")
      .populate("committeeHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy")
      .lean();

    return NextResponse.json({ success: true, committee: withCommitteeName(populatedCommittee) }, { status: 200 });
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

    await connectMongo();

    const committee = await Committee.findOne({ code: normalizeCode(code) });

    if (!committee) {
      return NextResponse.json(
        { success: false, message: "Committee not found" },
        { status: 404 }
      );
    }

    if (!isCommitteeHeadOrCoordinator(committee, user)) {
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