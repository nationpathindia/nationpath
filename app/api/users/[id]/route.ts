import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot modify yourself" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // ADMIN LOGIC
    if (currentUser.role === "admin") {
      if (targetUser.role === "admin") {
        return NextResponse.json(
          { error: "Cannot modify another admin" },
          { status: 403 }
        );
      }

      await prisma.user.update({
        where: { id: params.id },
        data: body,
      });

      return NextResponse.json({ success: true });
    }

    // EDITOR LOGIC
    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      delete body.role;

      await prisma.user.update({
        where: { id: params.id },
        data: body,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 403 }
      );
    }

    if (currentUser.role === "admin") {
      if (targetUser.role === "admin") {
        return NextResponse.json(
          { error: "Cannot delete another admin" },
          { status: 403 }
        );
      }

      await prisma.user.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    }

    if (currentUser.role === "editor") {
      if (targetUser.role !== "reporter") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      await prisma.user.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}