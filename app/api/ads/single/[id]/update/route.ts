import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    if (!params?.id) {
      return NextResponse.json(
        { success: false, message: "Ad ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

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

        priority: body.priority ? Number(body.priority) : 1,
        status: body.status || "active",

        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,

        totalBudget: body.totalBudget ? Number(body.totalBudget) : null,
        cpc: body.cpc ? Number(body.cpc) : null,
        maxClicks: body.maxClicks ? Number(body.maxClicks) : null,
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