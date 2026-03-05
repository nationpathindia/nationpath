import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "User exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "admin", // first user becomes admin
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}