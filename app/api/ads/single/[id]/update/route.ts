import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updatedAd = await prisma.ad.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        image: body.image,
        link: body.link,
        position: body.position,
        priority: body.priority,
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      ad: updatedAd,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to update ad" },
      { status: 500 }
    );
  }
}