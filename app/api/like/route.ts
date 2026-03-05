import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const articleId = body?.articleId;

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID required" },
        { status: 400 }
      );
    }

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        likes: { increment: 1 }
      },
      select: {
        likes: true
      }
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes
    });

  } catch (error) {

    console.error("LIKE API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }

}