import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { adId } = await req.json();

  await prisma.ad.delete({
    where: { id: adId },
  });

  return NextResponse.json({ success: true });
}