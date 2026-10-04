import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import AppSettings from "@/models/AppSettings";
import Event from "@/models/Event";

const DAY_KEYS = ["day1", "day2", "day3"];

function formatTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export async function GET() {
  try {
    await connectMongo();
    const settings = await AppSettings.findOne({ key: "access-control" }).lean();
    const scheduleDates = settings?.scheduleDates || {};
    const days = {};

    for (const dayKey of DAY_KEYS) {
      const date = scheduleDates[dayKey] || "";
      const groups = {};
      if (date) {
        const start = new Date(`${date}T00:00:00.000+05:30`);
        const end = new Date(`${date}T23:59:59.999+05:30`);
        const events = await Event.find({ startsAt: { $gte: start, $lte: end } })
          .populate("eventNameId", "name")
          .populate("categoryId", "name")
          .sort({ startsAt: 1 })
          .lean();

        for (const event of events) {
          const category = event.categoryId?.name || event.category || "Uncategorized";
          if (!groups[category]) groups[category] = [];
          groups[category].push({
            name: event.eventNameId?.name || event.name || event.code,
            time: `${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}`,
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
        name: event.eventNameId?.name || event.name || event.code,
        time: `${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}`,
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
