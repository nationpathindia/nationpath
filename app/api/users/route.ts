import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["admin", "editor"].includes(currentUser.role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await dbConnect();

    const users = await User.find().select("-password").lean();

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}