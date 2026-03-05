import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (!params.id) {
      return NextResponse.json(
        { success: false, message: "Ad ID is required" },
        { status: 400 }
      );
    }

    const updatedAd = await prisma.ad.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        placement: body.placement,
        type: body.type,

        imageUrl: body.imageUrl || null,
        link: body.link || null,
        adsenseCode: body.adsenseCode || null,

        priority: Number(body.priority) || 1,
        status: body.status || "active",

        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,

        totalBudget: body.totalBudget || null,
        cpc: body.cpc || null,
        maxClicks: body.maxClicks || null,
      },
    });

    return NextResponse.json({
      success: true,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Ad update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update ad" },
      { status: 500 }
    );
  }
}