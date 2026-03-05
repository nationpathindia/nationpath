import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =========================
   GET ACTIVE CATEGORIES
========================= */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "active",
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("CATEGORY GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE CATEGORY
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Category name required" },
        { status: 400 }
      );
    }

    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

    // 🔎 Check if already exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        status: "active",
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("CATEGORY POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}