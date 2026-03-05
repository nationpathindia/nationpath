import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const trending = await prisma.article.findMany({
    where: {
      status: "approved",
      isDeleted: false,
      lastViewAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      trendingScore: "desc",
    },
    take: 10,
    include: {
      category: true,
    },
  });

  return NextResponse.json(trending);
}  