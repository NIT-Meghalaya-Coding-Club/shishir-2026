import { NextResponse } from "next/server";
import {
  adminCredentialsMatch,
  createAdminSessionValue,
  getAdminCookieName,
} from "@/lib/adminAuth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!adminCredentialsMatch(String(email || ""), String(password || ""))) {
      return NextResponse.json({ success: false, message: "Invalid admin credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(getAdminCookieName(), createAdminSessionValue(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "Could not sign in" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminCookieName(), "", { maxAge: 0, path: "/" });
  return response;
}
