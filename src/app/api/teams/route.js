import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import "@/models/CommitteeName";

const memberGroups = [
  ["committeeHeads", "Head"],
  ["coordinators", "Coordinator"],
  ["coCoordinators", "Co-Coordinator"],
];

export async function GET() {
  try {
    await connectMongo();

    const committees = await Committee.find({})
      .populate("committeeNameId", "name")
      .populate("committeeHeads", "name phone email image")
      .populate("coordinators", "name phone email image")
      .populate("coCoordinators", "name phone email image")
      .sort({ name: 1 })
      .lean();

    const teams = committees
      .map((committee) => ({
      name: committee.committeeNameId?.name || committee.name || "",
      members: memberGroups.flatMap(([field, position]) =>
        (committee[field] || [])
          .filter((person) => person && typeof person === "object" && person.name)
          .map((person) => ({
            name: person.name,
            contactNo: person.phone || "",
            email: person.email || "",
            position,
            imageLink: person.image || undefined,
          }))
      ),
      }))
      .filter((team) => team.name);

    return NextResponse.json({ success: true, teams }, { status: 200 });
  } catch (error) {
    console.error("Fetch teams error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
