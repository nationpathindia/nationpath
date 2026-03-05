import { NextResponse } from "next/server";
import Ad from "@/app/models/Ad";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const body = await req.json();

  await Ad.findByIdAndUpdate(params.id, body);

  return NextResponse.json({ success: true });
}