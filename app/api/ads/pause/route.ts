import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { adId } = await req.json();

  await prisma.ad.update({
    where: { id: adId },
    data: { status: "paused" },
  });

  return NextResponse.json({ success: true });
}