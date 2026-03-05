import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("nationpath");

    await db.collection("articles").updateOne(
      { slug: params.slug },
      { $inc: { views: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "View failed" }, { status: 500 });
  }
}