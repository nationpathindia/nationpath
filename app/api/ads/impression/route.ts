import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const { adId } = body;

    if (!adId) {
      return NextResponse.json(
        { success: false, message: "Ad ID missing" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      select: { id: true, status: true }
    });

    if (!ad || ad.status !== "active") {
      return NextResponse.json({ success: false });
    }

    await prisma.ad.update({
      where: { id: adId },
      data: {
        views: { increment: 1 }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Ad impression error:", error);

    return NextResponse.json(
      { success: false, message: "Impression failed" },
      { status: 500 }
    );

  }

}