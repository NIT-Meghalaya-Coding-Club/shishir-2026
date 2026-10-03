import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import CommitteeName from "@/models/CommitteeName";
import { resolveUsersByEmails } from "@/lib/eventAuth";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Admin authentication required" }, { status: 401 });
}

export async function PATCH(req, { params }) {
  if (!(await isAdminRequest())) return unauthorized();
  try {
    await connectMongo();
    const committee = await Committee.findOne({ code: String((await params).code).trim().toLowerCase() });
    if (!committee) return NextResponse.json({ success: false, message: "Committee not found" }, { status: 404 });
    const payload = await req.json();
    const name = String(payload.name || "").trim().replace(/\s+/g, " ");
    const code = committee.code;
    if (!name) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    const committeeName = payload.committeeNameId
      ? await CommitteeName.findById(payload.committeeNameId)
      : await CommitteeName.findOneAndUpdate(
        { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
        { $setOnInsert: { name } }, { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    if (!committeeName) return NextResponse.json({ success: false, message: "Committee name not found" }, { status: 400 });
    const heads = await resolveUsersByEmails(payload.committeeHeadEmails || [], "committee heads");
    if (heads.length === 0) return NextResponse.json({ success: false, message: "Add at least one committee head" }, { status: 400 });
    const coordinators = await resolveUsersByEmails(payload.coordinatorEmails || [], "coordinators");
    const coCoordinators = await resolveUsersByEmails(payload.coCoordinatorEmails || [], "co-coordinators");
    committee.committeeNameId = committeeName._id;
    committee.committeeHeads = heads.map((user) => user._id);
    committee.coordinators = coordinators.map((user) => user._id);
    committee.coCoordinators = coCoordinators.map((user) => user._id);
    await committee.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin committee update error:", error);
    return NextResponse.json({ success: false, message: error.message || "Could not update committee" }, { status: error.status || 500 });
  }
}
