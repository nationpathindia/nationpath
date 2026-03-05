import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json(
        { success: false, message: "ID missing" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: body.id },
    });

    return NextResponse.json(
      { success: true, message: "User deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}