import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Committee from "@/models/Committee";
import User from "@/models/User";

const memberGroups = [
  ["committeeHeads", "Head"],
  ["coordinators", "Coordinator"],
  ["coCoordinators", "Co-Coordinator"],
];

export async function GET() {
  try {
    await connectMongo();

    const committees = await Committee.find({})
      .sort({ name: 1 })
      .lean();
    const emails = committees.flatMap((committee) =>
      memberGroups.flatMap(([field]) =>
        (committee[field] || []).map((person) => person.email).filter(Boolean)
      )
    );
    const users = await User.find({ email: { $in: emails } })
      .select("email image")
      .lean();
    const imagesByEmail = new Map(
      users.map((user) => [user.email.toLowerCase(), user.image])
    );

    const teams = committees.map((committee) => ({
      name: committee.name,
      members: memberGroups.flatMap(([field, position]) =>
        (committee[field] || []).map((person) => ({
          name: person.name,
          contactNo: person.phone || "",
          email: person.email,
          position,
          imageLink:
            person.image || imagesByEmail.get(person.email.toLowerCase()) || undefined,
        }))
      ),
    }));

    return NextResponse.json({ success: true, teams }, { status: 200 });
  } catch (error) {
    console.error("Fetch teams error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
