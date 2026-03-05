import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const visitors = await prisma.visitorChat.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      visitors
    });

  } catch (error) {
    console.error("Visitors chat error:", error);

    return NextResponse.json(
      { error: "Failed to load visitors" },
      { status: 500 }
    );
  }
}