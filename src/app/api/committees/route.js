import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import CommitteeName from "@/models/CommitteeName";
import { getAccessSettings } from "@/lib/accessSettings";
import {
  canCreateCommittees,
  getCurrentUser,
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
  return {
    ...committee,
    name: committee.committeeNameId?.name || committee.name || "",
  };
}

function sortByConfiguredOrder(committees, committeeOrder) {
  const order = new Map(committeeOrder.map((id, index) => [String(id), index]));
  return committees.sort((a, b) => {
    const aIndex = order.get(String(a.committeeNameId?._id));
    const bIndex = order.get(String(b.committeeNameId?._id));
    if (aIndex !== undefined || bIndex !== undefined) {
      if (aIndex === undefined) return 1;
      if (bIndex === undefined) return -1;
      if (aIndex !== bIndex) return aIndex - bIndex;
    }
    return (a.committeeNameId?.name || a.name || "").localeCompare(b.committeeNameId?.name || b.name || "");
  });
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

async function findExistingCommitteeMessage(committeeName) {
  const existingCommittee = await Committee.findOne({
    $or: [
      { committeeNameId: committeeName._id },
      { name: { $regex: `^${committeeName.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    ],
  })
    .populate("committeeHeads", "name email")
    .lean();

  if (!existingCommittee) return null;
  const creator = existingCommittee.committeeHeads?.[0];
  return creator
    ? `A user named "${creator.name}" with email "${creator.email}" has already created this committee. Contact them to have your name added as a committee head.`
    : "This committee has already been created. Contact its existing committee heads to be added.";
}

async function generateUniqueCode() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = Array.from(randomBytes(8), (byte) =>
      characters[byte % characters.length]
    ).join("");

    if (!(await Committee.exists({ code }))) return code;
  }

  throw new Error("Could not generate a unique committee code");
}

export async function GET() {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const committees = await Committee.find({
      $or: [
        { committeeHeads: user._id },
        { coordinators: user._id },
        { coCoordinators: user._id },
      ],
    })
      .populate("committeeNameId", "name")
      .populate("committeeHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy")
      .lean();
    const settings = await getAccessSettings();

    return NextResponse.json(
      { success: true, committees: sortByConfiguredOrder(committees, (settings.committeeOrder || []).map(String)).map(withCommitteeName), canCreateCommittees: await canCreateCommittees(user) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch committees error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!(await canCreateCommittees(user))) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not allowed to create committees. Ask admin to give you access.",
        },
        { status: 403 }
      );
    }

    if (!user.collegeID || !user.name) {
      return NextResponse.json(
        { success: false, message: "Please complete your profile before creating committees" },
        { status: 400 }
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

    await connectMongo();

    const code = await generateUniqueCode();
    const committeeName = await resolveCommitteeName(payload);
    const duplicateMessage = await findExistingCommitteeMessage(committeeName);
    if (duplicateMessage) {
      return NextResponse.json(
        { success: false, message: duplicateMessage },
        { status: 409 }
      );
    }

    const committeeHeadIDs = [
      user.collegeID,
      ...(Array.isArray(payload.committeeHeadCollegeIDs)
        ? payload.committeeHeadCollegeIDs
        : []),
    ];

    const committeeHeadUsers = await resolveUsersByCollegeIDs(committeeHeadIDs, "committee heads");
    const coordinatorUsers = Array.isArray(payload.coordinatorEmails)
      ? await resolveUsersByEmails(payload.coordinatorEmails, "coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
        "coordinators"
      );
    const coCoordinatorUsers = Array.isArray(payload.coCoordinatorEmails)
      ? await resolveUsersByEmails(payload.coCoordinatorEmails, "co-coordinators", true)
      : await resolveUsersByCollegeIDs(
        Array.isArray(payload.coCoordinatorCollegeIDs)
          ? payload.coCoordinatorCollegeIDs
          : [],
        "co-coordinators"
      );

    const createdCommittee = await Committee.create({
      committeeNameId: committeeName._id,
      code,
      committeeHeads: committeeHeadUsers.map((u) => u._id),
      coordinators: coordinatorUsers.map((u) => u._id),
      coCoordinators: coCoordinatorUsers.map((u) => u._id),
    });

    const committee = await Committee.findById(createdCommittee._id)
      .populate("committeeHeads", "name email phone collegeID image dept yearOfStudy")
      .populate("committeeNameId", "name")
      .populate("coordinators", "name email phone collegeID image dept yearOfStudy")
      .populate("coCoordinators", "name email phone collegeID image dept yearOfStudy")
      .lean();

    return NextResponse.json({ success: true, committee: withCommitteeName(committee) }, { status: 201 });
  } catch (error) {
    console.error("Create committee error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}