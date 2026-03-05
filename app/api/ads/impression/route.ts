import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { adId } = await req.json();

    if (!adId) {
      return NextResponse.json(
        { success: false, message: "Ad ID missing" },
        { status: 400 }
      );
    }

    await prisma.ad.update({
      where: { id: adId },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Impression error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}