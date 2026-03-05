import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const targetUser = await User.findById(params.id);
    if (!targetUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (currentUser._id.toString() === targetUser._id.toString())
      return NextResponse.json({ error: "Cannot modify yourself" }, { status: 403 });

    const body = await req.json();

    // ADMIN LOGIC
    if (currentUser.role === "admin") {
      if (targetUser.role === "admin")
        return NextResponse.json({ error: "Cannot modify another admin" }, { status: 403 });

      Object.assign(targetUser, body);
      await targetUser.save();

      return NextResponse.json({ success: true });
    }

    // EDITOR LOGIC
    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      delete body.role; // editor cannot change role

      Object.assign(targetUser, body);
      await targetUser.save();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const targetUser = await User.findById(params.id);
    if (!targetUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (currentUser._id.toString() === targetUser._id.toString())
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 403 });

    // ADMIN
    if (currentUser.role === "admin") {
      if (targetUser.role === "admin")
        return NextResponse.json({ error: "Cannot delete another admin" }, { status: 403 });

      await targetUser.deleteOne();
      return NextResponse.json({ success: true });
    }

    // EDITOR
    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      await targetUser.deleteOne();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}