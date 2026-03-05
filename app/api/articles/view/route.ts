import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ success: false });
    }

    await prisma.article.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json({ success: false });
  }
}