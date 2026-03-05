import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ad" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updatedAd = await prisma.ad.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedAd);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ad.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Ad deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}