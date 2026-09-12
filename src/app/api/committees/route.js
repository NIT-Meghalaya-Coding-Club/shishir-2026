import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import Committee from "@/models/Committee";
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

    const committees = await Committee.find({
      "committeeHeads.email": user.email.toLowerCase(),
    })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      { success: true, committees, canCreateCommittees: await canCreateCommittees(user) },
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

    const code = await generateUniqueCode();

    const committeeHeadIDs = [
      user.collegeID,
      ...(Array.isArray(payload.committeeHeadCollegeIDs)
        ? payload.committeeHeadCollegeIDs
        : []),
    ];

    const committee = await Committee.create({
      name: payload.name,
      code,
      committeeHeads: await resolveUsersByCollegeIDs(committeeHeadIDs, "committee heads"),
      coordinators: Array.isArray(payload.coordinatorEmails)
        ? await resolveUsersByEmails(payload.coordinatorEmails, "coordinators", true)
        : await resolveUsersByCollegeIDs(
          Array.isArray(payload.coordinatorCollegeIDs) ? payload.coordinatorCollegeIDs : [],
          "coordinators"
        ),
      coCoordinators: await resolveUsersByCollegeIDs(
        Array.isArray(payload.coCoordinatorCollegeIDs)
          ? payload.coCoordinatorCollegeIDs
          : [],
        "co-coordinators"
      ),
    });

    return NextResponse.json({ success: true, committee }, { status: 201 });
  } catch (error) {
    console.error("Create committee error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.status || 500 }
    );
  }
}