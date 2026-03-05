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

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!ad || ad.status !== "active") {
      return NextResponse.json({ success: false });
    }

    const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: {
        clicks: { increment: 1 },
      },
    });

    /* Auto pause if maxClicks reached */

    if (updatedAd.maxClicks && updatedAd.clicks >= updatedAd.maxClicks) {

      await prisma.ad.update({
        where: { id: adId },
        data: {
          completed: true,
          status: "paused",
        },
      });

    }

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Click error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}