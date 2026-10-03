import { NextResponse } from "next/server";
import { getR2Object } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    const objectKey = (await params).key?.join("/");
    if (!objectKey || !objectKey.startsWith("teams/")) {
      return NextResponse.json({ message: "Invalid team image" }, { status: 400 });
    }
    const object = await getR2Object(objectKey);
    if (!object) return NextResponse.json({ message: "Team image not found" }, { status: 404 });
    return new Response(object.body, {
      headers: { "Content-Type": object.contentType, "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("Team image read error:", error);
    return NextResponse.json({ message: "Could not load team image" }, { status: 404 });
  }
}
