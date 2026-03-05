import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const { userEmail } = body;

    if (!userEmail)
      return NextResponse.json({ error: "Login required" });

    const client = await clientPromise;
    const db = client.db("nationpath");

    const article = await db
      .collection("articles")
      .findOne({ slug: params.slug });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (article.likedBy?.includes(userEmail)) {
      return NextResponse.json({ message: "Already liked" });
    }

    await db.collection("articles").updateOne(
      { slug: params.slug },
      {
        $inc: { likes: 1 },
        $push: { likedBy: userEmail },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Like failed" }, { status: 500 });
  }
}