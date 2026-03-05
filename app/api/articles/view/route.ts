import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  try {

    /* ================= SAFE BODY PARSE ================= */

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { slug } = body;

    /* ================= VALIDATION ================= */

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, error: "Article slug required" },
        { status: 400 }
      );
    }

    /* ================= UPDATE VIEWS ================= */

    const article = await prisma.article.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
        lastViewAt: new Date()
      },
      select: {
        views: true
      }
    });

    return NextResponse.json({
      success: true,
      views: article.views
    });

  } catch (error) {

    console.error("ARTICLE VIEW ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update view" },
      { status: 500 }
    );

  }

}