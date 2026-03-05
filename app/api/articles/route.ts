import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/* ================= UTIL ================= */

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>?/gm, "") || "";
}

async function generateUniqueSlug(title: string, currentId?: string) {

  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const existing = await prisma.article.findFirst({
      where: {
        slug,
        NOT: currentId ? { id: currentId } : undefined,
      },
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

/* ================= GET ARTICLES ================= */

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 6, 20);

    const statusParam = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const editorial = searchParams.get("editorial");
    const astrology = searchParams.get("astrology");
    const lightweight = searchParams.get("lightweight") === "true";

    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (statusParam) {

      const formatted = statusParam.toLowerCase() as PostStatus;

      if (Object.values(PostStatus).includes(formatted)) {
        where.status = formatted;
      }

    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (editorial === "true") where.isEditorial = true;
    if (editorial === "false") where.isEditorial = false;

    if (astrology === "true") where.isAstrology = true;
    if (astrology === "false") where.isAstrology = false;

    const [articles, total] = await Promise.all([

      prisma.article.findMany({

        where,

        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          images: true,
          createdAt: true,
          views: true,

          breaking: true,
          flash: true,
          featured: true,

          breakingPriority: true,
          flashPriority: true,
          homepagePriority: true,

          status: true,
          isEditorial: true,
          isAstrology: true,

          category: lightweight
            ? undefined
            : {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },

          author: lightweight
            ? undefined
            : {
                select: {
                  id: true,
                  name: true,
                },
              },
        },

        orderBy: { createdAt: "desc" },

        skip,
        take: limit,
      }),

      prisma.article.count({ where }),

    ]);

    return NextResponse.json({
      success: true,
      articles,
      totalPages: Math.ceil(total / limit),
      totalArticles: total,
    });

  } catch (error) {

    console.error("GET ARTICLES ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );

  }

}

/* ================= CREATE ARTICLE ================= */

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const isEditorial = Boolean(body.isEditorial);
    const isAstrology = Boolean(body.isAstrology);

    if (!body.title?.trim())
      return NextResponse.json(
        { success: false, error: "Title required" },
        { status: 400 }
      );

    if (!body.content?.trim())
      return NextResponse.json(
        { success: false, error: "Content required" },
        { status: 400 }
      );

    if (!isEditorial && !isAstrology && !body.categoryId)
      return NextResponse.json(
        { success: false, error: "Category required" },
        { status: 400 }
      );

    if (body.categoryId && !isEditorial && !isAstrology) {

      const categoryExists = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });

      if (!categoryExists)
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 400 }
        );

    }

    const slug = await generateUniqueSlug(body.title);

    const cleanContent = stripHtml(body.content);

    const cleanImages = Array.isArray(body.images)
      ? body.images
          .filter((img: any) => typeof img === "string" && img.trim())
          .map((img: string) => img.trim())
      : [];

    let validStatus: PostStatus = PostStatus.pending;

    if (body.status) {

      const formatted = body.status.toLowerCase() as PostStatus;

      if (Object.values(PostStatus).includes(formatted)) {
        validStatus = formatted;
      }

    }

    const article = await prisma.article.create({

      data: {

        title: body.title.trim(),
        slug,

        content: body.content,

        excerpt: body.excerpt || cleanContent.substring(0, 200),

        images: cleanImages,

        videoUrl: body.videoUrl || null,

        breaking: Boolean(body.breaking),
        flash: Boolean(body.flash),
        featured: Boolean(body.featured),

        breakingPriority: Number(body.breakingPriority) || 0,
        flashPriority: Number(body.flashPriority) || 0,
        homepagePriority: Number(body.homepagePriority) || 0,

        isEditorial,
        isAstrology,

        status: validStatus,

        metaTitle: body.metaTitle || body.title,

        metaDescription:
          body.metaDescription || cleanContent.substring(0, 160),

        metaKeywords:
          body.metaKeywords ||
          body.title
            .toLowerCase()
            .split(" ")
            .slice(0, 10)
            .join(", "),

        categoryId:
          isEditorial || isAstrology ? null : body.categoryId,

      },

      include: {
        category: true,
      },

    });

    return NextResponse.json({

      success: true,
      id: article.id,
      slug: article.slug,
      category: article.category,

    });

  } catch (error: any) {

    console.error("CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Server error",
      },
      { status: 500 }
    );

  }

}

/* ================= DELETE ================= */

export async function DELETE(req: Request) {

  try {

    const body = await req.json();

    if (!body.id)
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );

    await prisma.article.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {

    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Delete failed",
      },
      { status: 500 }
    );

  }

}