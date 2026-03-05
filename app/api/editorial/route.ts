import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import connectDB from "@/lib/connectDB";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const newEditorial = await Post.create({
    title: body.title,
    content: body.content,
    category: "editorial",
    status: "approved",
  });

  return NextResponse.json(newEditorial);
}