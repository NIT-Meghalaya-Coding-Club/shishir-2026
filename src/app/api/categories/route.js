import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/models/Category";
import { canCreateEvents, getCurrentUser } from "@/lib/eventAuth";

const DEFAULT_CATEGORIES = [
  "DANCE AND DRAMA CLUB",
  "EBSB CLUB",
  "FUN EVENTS",
  "GAMING",
  "KRIGG",
  "LITERARY CLUB",
  "MAINS",
  "MODEL UNITED NATIONS",
  "MUSIC CLUB",
  "PHOTOGRAPHY & FINE ARTS CLUB",
];

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

export async function GET() {
  try {
    await connectMongo();
    await Category.bulkWrite(
      DEFAULT_CATEGORIES.map((name) => ({
        updateOne: {
          filter: { name },
          update: { $setOnInsert: { name } },
          upsert: true,
        },
      }))
    );
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("Fetch categories error:", error);
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

    if (!canCreateEvents(user)) {
      return NextResponse.json(
        { success: false, message: "You are not allowed to create categories" },
        { status: 403 }
      );
    }

    const name = normalizeName((await req.json()).name);
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    await connectMongo();
    const category = await Category.findOneAndUpdate(
      { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
      { $setOnInsert: { name } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}
