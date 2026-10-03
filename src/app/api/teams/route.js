import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import SacPost from "@/models/SacPost";
import "@/models/CommitteeName";
import "@/models/User";
import { getAccessSettings } from "@/lib/accessSettings";

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
      .lean();
    const settings = await getAccessSettings();
    const order = new Map((settings.committeeOrder || []).map((id, index) => [String(id), index]));
    committees.sort((a, b) => {
      const aIndex = order.get(String(a.committeeNameId?._id));
      const bIndex = order.get(String(b.committeeNameId?._id));
      if (aIndex !== undefined || bIndex !== undefined) {
        if (aIndex === undefined) return 1;
        if (bIndex === undefined) return -1;
        if (aIndex !== bIndex) return aIndex - bIndex;
      }
      return (a.committeeNameId?.name || a.name || "").localeCompare(b.committeeNameId?.name || b.name || "");
    });

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

    const sacPosts = await SacPost.find({}).sort({ order: 1, createdAt: 1 }).lean();
    if (sacPosts.length) {
      teams.unshift({
        name: "Student Activity Center (SAC)",
        members: sacPosts.map((person) => ({
          name: person.name,
          contactNo: person.phone,
          email: person.email,
          position: person.post,
          imageLink: person.image || undefined,
        })),
      });
    }

    return NextResponse.json({ success: true, teams }, { status: 200 });
  } catch (error) {
    console.error("Fetch teams error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
