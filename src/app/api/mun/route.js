import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MunPost from "@/models/MunPost";
import User from "@/models/User";
import { canAccessMunDashboard, getCurrentUser } from "@/lib/eventAuth";

function unauthorized() {
  return NextResponse.json({ success: false, message: "MUN dashboard access required" }, { status: 403 });
}

function normalizeUserIds(value) {
  return [...new Set((Array.isArray(value) ? value : [])
    .map((id) => String(id || "").trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id)))];
}

async function getAuthorizedUser() {
  const { user } = await getCurrentUser();
  if (!user || !(await canAccessMunDashboard(user))) return null;
  return user;
}

export async function GET() {
  try {
    if (!(await getAuthorizedUser())) return unauthorized();
    const posts = await MunPost.find()
      .populate("users", "name email collegeID dept yearOfStudy image")
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Load MUN posts error:", error);
    return NextResponse.json({ success: false, message: "Could not load MUN posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await getAuthorizedUser())) return unauthorized();
    const payload = await request.json();
    const title = String(payload.title || "").trim();
    const userIds = normalizeUserIds(payload.userIds);
    if (!title || title.length > 120) {
      return NextResponse.json({ success: false, message: "Post title is required and must be 120 characters or fewer" }, { status: 400 });
    }
    if (userIds.length === 0) {
      return NextResponse.json({ success: false, message: "Assign at least one user to this post" }, { status: 400 });
    }
    if (userIds.length !== (Array.isArray(payload.userIds) ? new Set(payload.userIds.map(String)).size : 0)) {
      return NextResponse.json({ success: false, message: "Post contains invalid user IDs" }, { status: 400 });
    }
    const userCount = await User.countDocuments({ _id: { $in: userIds } });
    if (userCount !== userIds.length) {
      return NextResponse.json({ success: false, message: "One or more assigned users were not found" }, { status: 400 });
    }
    const lastPost = await MunPost.findOne().sort({ order: -1 }).select("order").lean();
    const post = await MunPost.create({ title, users: userIds, order: (lastPost?.order ?? -1) + 1 });
    const result = await MunPost.findById(post._id).populate("users", "name email collegeID dept yearOfStudy image").lean();
    return NextResponse.json({ success: true, post: result }, { status: 201 });
  } catch (error) {
    console.error("Create MUN post error:", error);
    return NextResponse.json({ success: false, message: "Could not create MUN post" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await getAuthorizedUser())) return unauthorized();
    const payload = await request.json();
    const id = String(payload.id || "");
    const title = String(payload.title || "").trim();
    const userIds = normalizeUserIds(payload.userIds);
    const order = Number.isInteger(payload.order) ? payload.order : undefined;
    if (!mongoose.Types.ObjectId.isValid(id) || !title || title.length > 120 || userIds.length === 0) {
      return NextResponse.json({ success: false, message: "A valid post, title, and at least one assigned user are required" }, { status: 400 });
    }
    const userCount = await User.countDocuments({ _id: { $in: userIds } });
    if (userCount !== userIds.length) {
      return NextResponse.json({ success: false, message: "One or more assigned users were not found" }, { status: 400 });
    }
    const updates = { title, users: userIds };
    if (order !== undefined) updates.order = order;
    const post = await MunPost.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate("users", "name email collegeID dept yearOfStudy image")
      .lean();
    if (!post) return NextResponse.json({ success: false, message: "MUN post not found" }, { status: 404 });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Update MUN post error:", error);
    return NextResponse.json({ success: false, message: "Could not update MUN post" }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
      if (!(await getAuthorizedUser())) return unauthorized();
      const payload = await request.json();
      const orderedPosts = Array.isArray(payload.posts) ? payload.posts : [];
      const validPosts = orderedPosts.filter((post) => mongoose.Types.ObjectId.isValid(String(post?.id || "")));
      if (validPosts.length !== orderedPosts.length) {
        return NextResponse.json({ success: false, message: "Post order contains an invalid post" }, { status: 400 });
      }
      await Promise.all(validPosts.map((post, order) => MunPost.findByIdAndUpdate(post.id, { order })));
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Update MUN post order error:", error);
      return NextResponse.json({ success: false, message: "Could not update MUN post order" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await getAuthorizedUser())) return unauthorized();
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "A valid post is required" }, { status: 400 });
    }
    const result = await MunPost.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ success: false, message: "MUN post not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete MUN post error:", error);
    return NextResponse.json({ success: false, message: "Could not delete MUN post" }, { status: 500 });
  }
}
