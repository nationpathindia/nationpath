import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { articleId } = await req.json();

    if (!articleId) {
      return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
    }

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        likes: { increment: 1 },
      },
      select: {
        likes: true,
      },
    });

    return NextResponse.json({ likes: updated.likes });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}