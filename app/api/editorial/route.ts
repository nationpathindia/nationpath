import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || "",
        images: body.images || [],
        isEditorial: true,
        status: "approved",
        publishedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error("Editorial create error:", error);

    return NextResponse.json(
      { error: "Failed to create editorial" },
      { status: 500 }
    );
  }
}