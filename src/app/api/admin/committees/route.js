import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import CommitteeName from "@/models/CommitteeName";
import { resolveUsersByEmails } from "@/lib/eventAuth";

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Admin authentication required" },
    { status: 401 },
  );
}

function normalizeEmails(value) {
  const values = Array.isArray(value)
    ? value
    : String(value || "").split(/[\n,]+/);
  return [
    ...new Set(
      values.map((email) => String(email).trim().toLowerCase()).filter(Boolean),
    ),
  ];
}

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toLowerCase();
}

async function generateUniqueCode() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = Array.from(
      randomBytes(8),
      (byte) => characters[byte % characters.length],
    ).join("");
    if (!(await Committee.exists({ code }))) return code;
  }
  throw new Error("Could not generate a unique committee code");
}

async function resolveCommitteeName(payload) {
  if (payload.committeeNameId) {
    const committeeName = await CommitteeName.findById(payload.committeeNameId);
    if (committeeName) return committeeName;
  }

  const name = String(payload.name || "")
    .trim()
    .replace(/\s+/g, " ");
  return CommitteeName.findOneAndUpdate(
    {
      name: {
        $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    },
    { $setOnInsert: { name } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function findExistingCommitteeMessage(committeeName) {
  const existingCommittee = await Committee.findOne({
    $or: [
      { committeeNameId: committeeName._id },
      {
        name: {
          $regex: `^${committeeName.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
      },
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

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  await connectMongo();
  const committees = await Committee.find()
    .populate("committeeNameId", "name")
    .populate("committeeHeads", "name email collegeID")
    .populate("coordinators", "name email collegeID")
    .populate("coCoordinators", "name email collegeID")
    .sort({ "committeeNameId.name": 1 })
    .lean();
  return NextResponse.json({ success: true, committees });
}

export async function POST(req) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const payload = await req.json();
    const missing = ["name"].filter(
      (field) => !String(payload[field] || "").trim(),
    );
    if (missing.length)
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 },
      );

    const code = await generateUniqueCode();
    const committeeName = await resolveCommitteeName(payload);
    const duplicateMessage = await findExistingCommitteeMessage(committeeName);
    if (duplicateMessage)
      return NextResponse.json(
        { success: false, message: duplicateMessage },
        { status: 409 },
      );

    const heads = await resolveUsersByEmails(
      normalizeEmails(payload.committeeHeadEmails),
      "committee heads",
    );
    if (heads.length === 0)
      return NextResponse.json(
        { success: false, message: "Add at least one committee head" },
        { status: 400 },
      );
    const coordinators = await resolveUsersByEmails(
      normalizeEmails(payload.coordinatorEmails),
      "coordinators",
    );
    const coCoordinators = await resolveUsersByEmails(
      normalizeEmails(payload.coCoordinatorEmails),
      "co-coordinators",
    );

    const createdCommittee = await Committee.create({
      committeeNameId: committeeName._id,
      code,
      committeeHeads: heads.map((u) => u._id),
      coordinators: coordinators.map((u) => u._id),
      coCoordinators: coCoordinators.map((u) => u._id),
    });

    const committee = await Committee.findById(createdCommittee._id)
      .populate("committeeNameId", "name")
      .populate("committeeHeads", "name email collegeID")
      .populate("coordinators", "name email collegeID")
      .populate("coCoordinators", "name email collegeID")
      .lean();

    return NextResponse.json({ success: true, committee }, { status: 201 });
  } catch (error) {
    console.error("Admin create committee error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Could not create committee",
      },
      { status: error.status || 500 },
    );
  }
}
