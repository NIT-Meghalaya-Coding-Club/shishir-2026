import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function GET(_request, { params }) {
  try {
    const { key } = await params;
    const objectKey = key?.join("/");

    if (!objectKey || !objectKey.startsWith("profiles/")) {
      return NextResponse.json({ message: "Invalid profile image" }, { status: 400 });
    }

    const response = await getR2Client().send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
      })
    );

    if (!response.Body) {
      return NextResponse.json({ message: "Profile image not found" }, { status: 404 });
    }

    return new Response(response.Body, {
      headers: {
        "Content-Type": response.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Profile image read error:", error);
    return NextResponse.json({ message: "Could not load profile image" }, { status: 404 });
  }
}