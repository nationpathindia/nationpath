import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";

/* ================= GET SINGLE ARTICLE ================= */

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        slug: params.slug,
        status: PostStatus.approved,
        isDeleted: false,
        // ❌ removed isEditorial restriction
        // so it works for normal + horoscope
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
        },
             },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    /* ===== SAFE VIEW INCREMENT (non blocking) ===== */
    prisma.article
      .update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    /* ===== RETURN FIXED FORMAT (frontend compatible) ===== */
    return NextResponse.json({
      success: true,
      article, // ✅ IMPORTANT: was "data"
    });
  } catch (error) {
    console.error("FETCH ARTICLE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

/* ================= ADD COMMENT ================= */

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();

    if (!body.comment?.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findFirst({
      where: {
        slug: params.slug,
        status: PostStatus.approved,
        isDeleted: false,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: body.comment.trim(),
        articleId: article.id,
      },
    });

    return NextResponse.json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

/* ================= DELETE COMMENT ================= */

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body.commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID required" },
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: { id: body.commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}