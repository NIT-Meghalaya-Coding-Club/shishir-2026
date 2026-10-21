import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import AppSettings from "@/models/AppSettings";
import Event from "@/models/Event";
import { formatISTTime, getISTDayRange } from "@/lib/ist";

const DAY_KEYS = ["day1", "day2", "day3"];

export async function GET() {
  try {
    await connectMongo();
    const settings = await AppSettings.findOne({ key: "access-control" }).lean();
    const scheduleDates = settings?.scheduleDates || {};
    const days = {};

    for (const dayKey of DAY_KEYS) {
      const date = scheduleDates[dayKey] || "";
      const groups = {};
      const range = date ? getISTDayRange(date) : null;
      if (range) {
        const events = await Event.find({ startsAt: { $gte: range.start, $lte: range.end } })
          .populate("eventNameId", "name")
          .populate("categoryId", "name")
          .sort({ startsAt: 1 })
          .lean();

        for (const event of events) {
          const category = event.categoryId?.name || event.category || "Uncategorized";
          if (!groups[category]) groups[category] = [];
          groups[category].push({
            code: event.code,
            name: event.eventNameId?.name || event.name || event.code,
            time: `${formatISTTime(event.startsAt)} - ${formatISTTime(event.endsAt)}`,
            place: event.location,
            description: event.description,
            category,
          });
        }
      }
      days[dayKey] = { date, categories: groups };
    }

    const allEvents = await Event.find({})
      .populate("eventNameId", "name")
      .populate("categoryId", "name")
      .sort({ startsAt: 1 })
      .lean();
    const allGroups = {};
    for (const event of allEvents) {
      const category = event.categoryId?.name || event.category || "Uncategorized";
      if (!allGroups[category]) allGroups[category] = [];
      allGroups[category].push({
        code: event.code,
        name: event.eventNameId?.name || event.name || event.code,
        time: `${formatISTTime(event.startsAt)} - ${formatISTTime(event.endsAt)}`,
        place: event.location,
        description: event.description,
        category,
      });
    }
    days.all = { date: "", categories: allGroups };

    return NextResponse.json({ success: true, days });
  } catch (error) {
    console.error("Fetch schedule error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
