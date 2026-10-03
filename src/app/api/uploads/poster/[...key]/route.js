import { NextResponse } from "next/server";
import { getR2Object } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    const { key } = await params;
    const objectKey = key?.join("/");

    if (!objectKey || !objectKey.startsWith("posters/")) {
      return NextResponse.json({ message: "Invalid poster" }, { status: 400 });
    }

    const object = await getR2Object(objectKey);
    if (!object) {
      return NextResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": object.contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Poster read error:", error);
    return NextResponse.json({ message: "Could not load poster" }, { status: 404 });
  }
}
