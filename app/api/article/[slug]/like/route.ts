import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {

    if (!params?.slug) {
      return NextResponse.json(
        { error: "Article slug required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        likes: true
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.article.update({
      where: {
        slug: params.slug,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        likes: true
      }
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes,
    });

  } catch (error) {

    console.error("Like error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}