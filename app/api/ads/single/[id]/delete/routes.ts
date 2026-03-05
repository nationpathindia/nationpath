import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Ad from "@/app/models/Ad";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  await Ad.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}