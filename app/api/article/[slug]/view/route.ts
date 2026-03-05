import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        views: true
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
        views: {
          increment: 1,
        },
        lastViewAt: new Date(),
      },
      select: {
        views: true
      }
    });

    return NextResponse.json({
      success: true,
      views: updated.views,
    });

  } catch (error) {

    console.error("View update error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}